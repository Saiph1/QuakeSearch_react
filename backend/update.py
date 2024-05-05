import os
import psycopg2
import requests
import xmltodict
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Reading parameters from .env files
DB_HOST=os.getenv('DB_HOST')
DB_PORT=os.getenv('DB_PORT')
DB_NAME=os.getenv('DB_NAME')
DB_USER=os.getenv('DB_USER')
DB_PASSWORD=os.getenv('DB_PASSWORD')

def earthquake_data():
    # Make a request to the API and fetch the data
    print("Fetching data from usgs...")
    response = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=xml&minmagnitude=3&starttime=2024-01-01&limit=1000")
    if response.status_code == 200:
        print("Data received from usgs.")
        text_data = response.text.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
        data = xmltodict.parse(text_data)
        # print(data['q:quakeml']['eventParameters']['event'])
        # print(len(data['q:quakeml']['eventParameters']['event']))
        return data['q:quakeml']['eventParameters']['event']
    else:
        print("Error fetching data from usgs:", response.status_code, response)
        return None

def update_db():

    conn = psycopg2.connect(
        user = DB_USER,
        password = DB_PASSWORD ,
        host = DB_HOST,
        port = DB_PORT ,
        database = DB_NAME
    )

    cursor = conn.cursor()
    try:
        data = earthquake_data()

        if not data:
            return
        
        # create the time table if not existed. 
        time_query = "CREATE TABLE IF NOT EXISTS lastupdate (time VARCHAR(255) NOT NULL);" 
        cursor.execute(time_query)

        time_now = datetime.now() + timedelta(hours=8)
        # First update the time:
        update_time_query = "INSERT INTO lastupdate (time) VALUES ('" + time_now.strftime("%Y-%m-%d %H:%M:%S") + "');"
        cursor.execute(update_time_query)

        # Secondly, truncate and insert the table.
        truncate_query = "TRUNCATE TABLE earthquakes;"
        cursor.execute(truncate_query)

        insert_query = "INSERT INTO earthquakes (Location, Mag, Lat, Long, Time) VALUES (%s, %s, %s, %s, %s);"

        buff = []
        for item in data:
            buff.append((item['description']['text'], 
                         item['magnitude']['mag']['value'],
                         item['origin']['latitude']['value'],
                         item['origin']['longitude']['value'],
                         item['origin']['time']['value']
                         ))

        cursor.executemany(insert_query, buff)

        # Commit the changes to the database
        conn.commit()

        print("Update successful!")
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error updating the database:", error)
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

if __name__ == "__main__":

    update_db()
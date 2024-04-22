#  [QuakeSearch](https://quakesearch.lchsuan.life/)

A lightweight earthquake query application powered by React, Express.js, PostgreSQL and AWS.

Access the project [here](https://quakesearch.lchsuan.life/)

<h3>🛠&nbsp;Getting started with development: </h3>

1. First install nodejs at https://nodejs.org/en/download/
1. Clone this repository
1. Install required libraries for both front-end and back-end:
   
    ```
    cd frondend
    npm install
    cd ../backend
    npm install
    ```
1. Run node web server and API server in development mode:
    ```
    cd frontend
    npm start
    cd ../backend
    node index.js
    ```
1. Configure the .env file with your PostgreSQL connection parameters under this path:

   ```
   # backend/
   #  .env  <----Here
   #  db.js
   #  index.js
   #    .
   #    .
   #    .
   ```

with the following content, please replace accordingly:

   ```
   DB_HOST='localhost'
   DB_PORT='YOUR PORT'
   DB_NAME='YOUR_DB_NAME'
   DB_USER='YOUR_USER_NAME'
   DB_PASSWORD='YOUR_USER_PASSWORD'
   
   PORT = 3001
   ```

1. Access the project on:

   ```
   localhost:3000
   ```


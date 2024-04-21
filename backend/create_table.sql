CREATE TABLE earthquakes ( 
    id SERIAL PRIMARY KEY ,
    Location VARCHAR(255) NOT NULL,
    Mag FLOAT NOT NULL,
    Lat FLOAT NOT NULL,
    Long FLOAT NOT NULL,
    Time VARCHAR(255)
);

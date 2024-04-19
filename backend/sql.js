require('dotenv').config();
const {Client} = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT
})

// Connect to the database
client.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to PostgreSQL database!');
  
    // Example query
    client.query('SELECT * FROM users', (err, res) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      console.log('Query result:', res.rows);
      client.end(); // Close the connection
    });
});
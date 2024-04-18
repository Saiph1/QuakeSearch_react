const {Client} = require('pg');
const client = new Client{
    user: // ,
    host: //,
    database://, 
    password: //,
    port://,
}

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
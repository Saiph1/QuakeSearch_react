require('dotenv').config();
const Client = require('pg').Pool;

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})

// module.exports = {
//   query: (text, params) => client.query(text, params)
// };
module.exports = {
  client
};
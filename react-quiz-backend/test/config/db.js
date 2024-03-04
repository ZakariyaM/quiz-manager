const { Pool } = require('pg');

// Create a new PostgreSQL pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432, // default PostgreSQL port
});

// Export the pool for use in other parts of your application
module.exports = pool;
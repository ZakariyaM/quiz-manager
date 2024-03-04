const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require('./src/config/db');
require("dotenv").config({ path: "./config.env" });

const verifyToken = require("./src/routes/verifyToken");
const port = process.env.PORT || 5000;

// Connect to the PostgreSQL database
dbConfig.connect(err => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database');
  
  // Once connected, create tables if they don't exist
  createTables();

});

// Function to create tables if they don't exist
async function createTables() {
  try {
    await dbConfig.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        password TEXT,
        accountType TEXT,
        createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbConfig.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        name TEXT,
        description TEXT,
        createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId INTEGER
      )
    `);

    await dbConfig.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        body TEXT,
        answerId INTEGER,
        quizId INTEGER,
        number INTEGER
      )
    `);

    await dbConfig.query(`
      CREATE TABLE IF NOT EXISTS choices (
        id SERIAL PRIMARY KEY,
        body TEXT,
        questionId INTEGER,
        number INTEGER
      )
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Initalise application through setting up configurations and usages of things like frameworks and tokens
app.use(cors({origin: "*", exposedHeaders: ["auth-token"]}))
app.use(express.json())
app.use( "/auth", require("./src/routes/auth"))
app.use( "/quiz", verifyToken, require("./src/routes/quiz"))

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

module.exports = dbConfig 
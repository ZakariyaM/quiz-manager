const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require('./src/config/db');
require("dotenv").config({ path: "./config.env" });

const verifyToken = require("./src/routes/verifyToken");
const port = process.env.PORT || 5000;

// Initalise application through setting up configurations and usages of things like frameworks and tokens
app.use(cors({origin: "*", exposedHeaders: ["auth-token"]}))
app.use(express.json())
app.use( "/auth", require("./src/routes/auth"))
app.use( "/quiz", verifyToken, require("./src/routes/quiz"))

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

module.exports = dbConfig 
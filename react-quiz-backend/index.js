const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const verifyToken = require("./src/routes/verifyToken");
const port = process.env.PORT || 5000;

// Initalise application through setting up configurations and usages of things like frameworks and tokens
const corsConfig = {
    origin: "*",
    exposedHeaders: ["auth-token"],
    credentials: true, methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200
}

app.options("", cors(corsConfig))
app.use(cors(corsConfig))
app.use(express.json())
app.use("/auth", require("./src/routes/auth"))
app.use("/quiz", verifyToken, require("./src/routes/quiz"))

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

module.exports = app
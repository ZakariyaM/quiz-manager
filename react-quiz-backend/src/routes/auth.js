const express = require("express");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const authRoutes = express.Router();
const Joi = require("joi");
const pool = require('../config/db');

const commonUserAccountType = "COMMON";

// Schema validation performed to the login details entered
const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});

const getRequestDetails = (req) => {
  return ({ username, password } = req.body);
};

const loginAttempts = {}; // Object to track login attempts for each user

authRoutes.route("/login").post(async (req, res) => {
  const user = getRequestDetails(req);
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check if the user is temporarily locked out
    if (loginAttempts[user.username] && loginAttempts[user.username].count >= 3) {
      const lockoutTime = 60000; // 1 minute in milliseconds
      const lockoutEndTime = loginAttempts[user.username].lockoutTime + lockoutTime;
      if (Date.now() < lockoutEndTime) {
        const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000); // Remaining time in seconds
        return res.status(429).send(`Account temporarily locked. Please try again in ${remainingTime} seconds.`);
      } else {
        // Reset failed login attempts counter
        loginAttempts[user.username] = { count: 0, lockoutTime: 0 };
      }
    }

    const sqlFinderUser = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(sqlFinderUser, [user.username]);

    if (rows.length === 0) {
      return res.status(400).send(`Username does not exist, please register an account for "${user.username}" to proceed`);
    }

    const isValidPassword = passwordHash.verify(user.password, rows[0].password);
    if (isValidPassword) {
      // Reset failed login attempts counter upon successful login
      loginAttempts[user.username] = { count: 0, lockoutTime: 0 };

      // Create a new object with only the desired fields
      const userResponse = {
        id: rows[0].id,
        username: rows[0].username,
        accounttype: rows[0].accounttype
      };
      const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET);
      return res.header("auth-token", token).send(userResponse);
    } else {
      // Increment failed login attempts counter
      if (!loginAttempts[user.username]) {
        loginAttempts[user.username] = { count: 1, lockoutTime: 0 };
      } else {
        loginAttempts[user.username].count++;
      }

      // Set lockout time if the limit is reached to protect against brute force attacks
      // OWASP - Identification and Authentication failures 
      if (loginAttempts[user.username].count >= 3) {
        loginAttempts[user.username].lockoutTime = Date.now();
      }

      return res.status(400).send("Invalid username or password entered, please try again!");
    }
  } catch (error) {
    console.error(`Failed to login due to error: ${error}`);
    return res.status(501).send(error);
  }
});


authRoutes.route("/register").post(async (req, res) => {
  const user = getRequestDetails(req);
  const { error } = loginSchema.validate(user);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const sqlFinderUser = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(sqlFinderUser, [user.username]);

    if (rows.length !== 0) {
      return res.status(400).send("Username already exists, please proceed to login");
    }

    
    // Use of npm library passsword hash, hashes and adds a salt to the new password created by the user to store in the database.
    // The salt for each password is different for every user 
    // OWASP - Cryptographic failures 
    const hashedPassword = passwordHash.generate(user.password);
    const sql = `INSERT INTO users (username, password, accountType) VALUES ($1, $2, $3) RETURNING *`;
    const insertedUser = await pool.query(sql, [user.username, hashedPassword, commonUserAccountType]);

    const token = jwt.sign({ id: insertedUser.rows[0].id }, process.env.JWT_SECRET);
    res.header("auth-token", token).send({
      id: insertedUser.rows[0].id,
      username: user.username,
      accounttype: commonUserAccountType,
    });
  } catch (error) {
    console.error(`Failed to register user due to error: ${error}`);
    return res.status(501).send(error);
  }
});

authRoutes.route("/get").post(async (req, res) => {
  const { id } = req.body;

  try {
    const sql = 'SELECT id, username, accountType FROM users WHERE id = $1';
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(400).send(`Failed to get user, as they do not exist in the database for id: ${id}`);
    }

    return res.status(200).send(rows[0]);
  } catch (error) {
    console.error(`Error returned while fetching user: ${error}`);
    return res.status(501).send(error);
  }
});

module.exports = authRoutes;

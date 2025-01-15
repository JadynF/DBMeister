const express = require("express");
const cors = require('cors');
const mysql = require('mysql2/promise');
//const path = require('path');
//const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// SQL DATABASE CONNECTION
// Create a MySQL connection pool
const pool = mysql.createPool({
  /*
  host:
  user:
  password:
  admin:
  port:
  */
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database!');
    connection.release(); // Always release the connection back to the pool

    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Query result:', rows);
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    console.error('Stack trace:', error.stack);
  }
})();

/*
// Test the database connection
  pool.getConnection((err, connection) => {
  console.log("testing connection...")
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
  connection.release();
});
*/

//HELPER FUNCTIONS
//Sends promised SQL queries
async function sendQuery(query, list=[]) {
  try {
    const queryResponse = await pool.query(query, list);
    return queryResponse;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

//Creates a hash of a user's password using a salt
async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPass = await bcrypt.hash(password, salt);
  // Do not need to return salt, as salt is part of the hashed password
  return hashedPass;
}

//LISTENING FUNCTIONS
//Takes user's submitted login input, finds username (if exists), compares password
//Successful: Redirect to home page, user is assigned Authorization token
//Failure: Returns message of unsuccessful login
app.post('/login', async (req, res) => {
    let inUsername = req.body.username;
    let inPassword = req.body.password;
    console.log(inUsername);
    
    let realPassword = '';
    try {
      let queryResults = await sendQuery('SELECT password, isVerified FROM user_information WHERE username=?', [inUsername]);
      realPassword = queryResults[0][0].password;
      userVerified = queryResults[0][0].Verified;

      let passwordsMatched = await bcrypt.compare(inPassword, realPassword);
      if(!passwordsMatched) {
        return res.status(401).send(JSON.stringify({response: "Your password is incorrect."}));
      } else if(userVerified === 0) {
        return res.status(401).send(JSON.stringify({response: "User is not verified. Please verify the email registered with your account."}));
      } else {
        return res.status(200).send(JSON.stringify({response: "accepted"}));
      }
      //Logic for login here
    } catch (error) {
      console.log(error);
      return res.status(500).send(JSON.stringify({response: "Error fetching login information. Make sure your username is correct, or create an account."}));
    }
});

app.post('/Register', async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;
  const hashedPass = await hashPassword(password);
  const placeholderVerified = 1;
  //const vToken = crypto.randomBytes(20).toString('hex')
  try {
    //Insert user's information into User_information table
    await sendQuery('INSERT INTO user_information (firstName, lastName, username, password, email, isVerified) VALUES (?, ?, ?, ?, ?, ?)', [firstName, lastName, username, hashedPass, email, placeholderVerified]);

    return res.status(200).send(JSON.stringify({response: 'User registration was successful.'}));
  } catch (error) {
    return res.status(500).send(JSON.stringify({response: 'Error registering user.'}));
  }
});

app.listen(8000, () => {
  console.log(`Server listening on 8000`);
});
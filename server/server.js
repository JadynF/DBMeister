const express = require("express");
const cors = require('cors');
const app = express();
const mysql = require('mysql2/promise');
const path = require('path');

app.use(cors());
app.use(express.json());

// SQL DATABASE CONNECTION
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 
    user: 
    password: 
    database: 
    port: 
});

//Sends promised SQL queries
async function sendQuery(query, variables=[]) {
    try {
        const queryResponse = await pool.query(query, variables);
        return queryResponse;
    }
    catch (error) {
        console.log("Database Error: ", error);
        return false;
    }
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8000, () => {
    console.log(`Server listening on 8000`);
});
// lib/db.ts
import mysql, { Connection, ConnectionConfig } from 'mysql2';

// Define the connection configuration type
const connectionConfig: Partial<ConnectionConfig> = {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT) || 3306, // Default to 3306 if DB_PORT is not set
};

// Function to create a new connection to the database
export const createConnection = (): Connection => {
    return mysql.createConnection(connectionConfig);
};

// Create a database connection pool
//const pool = mysql.createPool({
  //  host: process.env.DB_HOST,
    //user: process.env.DB_USER,
   // password: process.env.DB_PASSWORD,
    //database: process.env.DB_NAME,
    //waitForConnections: true,
    //connectionLimit: 10,
    //queueLimit: 0,
//});

//export default pool;

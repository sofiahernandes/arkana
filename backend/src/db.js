// Database connection setup shared by the backend routes that still query MySQL directly.
import mysql from "mysql2/promise";
import "dotenv/config";

export const pool = await mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

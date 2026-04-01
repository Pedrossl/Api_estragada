import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "senacrs",
  database: "navesdb",
});

export default db;

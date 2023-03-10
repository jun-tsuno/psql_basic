const Pool = require("pg").Pool;

const pool = new Pool({
	user: process.env.DB_USER,
	host: "localhost",
	database: "users",
	password: process.env.DB_PASSWORD,
	port: 5432,
});

module.exports = pool;

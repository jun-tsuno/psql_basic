const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

// app.get("/", (req, res) => {
// 	res.send("Hello Express");
// });

app.use(express.json());

// get all user information
app.get("/users", (req, res) => {
	pool.query("SELECT * FROM users", (error, results) => {
		if (error) throw error;
		return res.status(200).json(results.rows);
	});
});

// get specific user
app.get("/users/:id", (req, res) => {
	const id = req.params.id;

	pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
		if (error) throw error;
		return res.status(200).json(results.rows);
	});
});

// add user
app.post("/users", (req, res) => {
	const { name, email, age } = req.body;
	// check if user is already exist
	pool.query(
		"SELECT s From users s WHERE s.email = $1",
		[email],
		(error, results) => {
			if (results.rows.length) {
				return res.send("Already Exist!!");
			}

			pool.query(
				"INSERT INTO users(name, email, age) values($1, $2, $3)",
				[name, email, age],
				(error, results) => {
					if (error) throw error;
					res.status(201).send("Successfully Add new User!!");
				}
			);
		}
	);
});

// delete user
app.delete("/users/:id", (req, res) => {
	const id = req.params.id;

	pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
		if (error) throw error;

		const isUserExist = results.rows.length;
		if (!isUserExist) {
			return res.send("User not Exist!!");
		}

		pool.query(
			"DELETE FROM users WHERE id = $1",
			[id],
			(error, results) => {
				if (error) throw error;
				return res.status(200).send("Successfully Deleted!");
			}
		);
	});
});

// update user
app.put("/users/:id", (req, res) => {
	const id = req.params.id;
	const name = req.body.name;

	pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
		if (error) throw error;

		const isUserExist = results.rows.length;
		if (!isUserExist) {
			return res.send("User not Exist!!");
		}

		pool.query(
			"UPDATE users SET name = $1 WHERE id = $2",
			[name, id],
			(error, results) => {
				if (error) throw error;
				return res.status(200).send("Successfully Updated!");
			}
		);
	});
});

app.listen(PORT, () => {
	console.log(`server is running on PORT ${PORT}`);
});

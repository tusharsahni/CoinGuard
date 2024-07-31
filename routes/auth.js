const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const router = express.Router();
require("dotenv").config(); // Ensure environment variables are loaded
const SECRET_KEY = process.env.SECRET_KEY;

// REGISTER ENDPOINT
router.post("/register", async (req, res) => {
  const { email, name, gender, password1, country, contact, budget} = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password1, 10);

    // Begin transaction
    await pool.query("BEGIN");

    try {
      // Insert user into database
      const userResult = await pool.query(
        `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id`,
        [email, hashedPassword]
      );

      const userId = userResult.rows[0].user_id;

      // Insert user details into database
      await pool.query(
        `INSERT INTO user_details (user_id, name, contact, country, gender,budget) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, name, contact, country, gender, budget]
      );

      // Commit transaction
      await pool.query("COMMIT");

      res.status(201).json({ message: "Welcome onboard!" });
    } catch (err) {
      // Rollback transaction in case of error
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// LOGIN ENDPOINT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user from database
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.user_id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user_id: user.user_id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

// VERIFY ENDPOINT
router.get("/verify", async (req, res) => {
  console.log(req.headers[`Authorization`]);
  const token = req.headers["Authorization"];
  console.log("token from verify", token);
  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("decoded", decoded);
    // Optionally, you can fetch user details from database based on decoded token
    const query = `
      SELECT email FROM users
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

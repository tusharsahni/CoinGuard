const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const router = express.Router();

//router is for a route handling
//because it does all the job of a middleware on its own its also known as a mini application
const SECRET_KEY = process.env.SECRET_KEY;

//REGISTER ENDPOINT
router.post("/register", async (req, res) => {
    const { email, password, name, contact, country, gender } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Begin transaction
        await pool.query('BEGIN');

        try {
            // Insert user into database
            const userResult = await pool.query(
                `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id`,
                [email, hashedPassword]
            );

            const userId = userResult.rows[0].user_id;

            // Insert user details into database
            await pool.query(
                `INSERT INTO user_details (user_id, name, contact, country, gender) VALUES ($1, $2, $3, $4, $5)`,
                [userId, name, contact, country, gender]
            );

            // Commit transaction
            await pool.query('COMMIT');

            res.status(201).json({ message: "Welcome onboard!" });
        } catch (err) {
            // Rollback transaction in case of error
            await pool.query('ROLLBACK');
            throw err;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server side error" });
    }
});

  

//LOGIN ENDPOINT
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
      const token = jwt.sign({ id: user.user_id }, SECRET_KEY, { expiresIn: "1h" });
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server side error" });
    }
  });
  

//VERIFY ENDPOINT
router.get("/verify", async (req, res) => {
    const token = req.headers["authorization"];
  
    if (!token) {
      return res.status(401).send("No token provided");
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
  
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
      res.status(500).send("Failed to authenticate token");
    }
  });
  
module.exports = router;
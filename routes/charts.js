const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("../db");

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.use(cors());
router.use(morgan("dev"));
router.use(express.json());

router.post("/piecharts/", async (req, res) => {
  const { userid } = req.body;

  try {
    const response = await pool.query(
      `SELECT category, SUM(amount) AS total_amount 
             FROM transactions 
             WHERE date >= DATE_TRUNC('month', CURRENT_DATE) 
               AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' 
               AND userid = $1
             GROUP BY category`,
      [userid]
    );

    res.status(200).json({ data: response.rows });
  } catch (error) {
    console.error("Error fetching data for pie chart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/progress", async (req, res) => {
  const { userid } = req.body;
  try {
    const response1 = await pool.query(
      `SELECT SUM(amount) AS total_amount FROM transactions 
      WHERE date >= DATE_TRUNC('month', CURRENT_DATE) 
      AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' 
      AND userid = $1`,
      [userid]
    );

    const response2 = await pool.query(
      `SELECT budget FROM user_details WHERE user_id = $1`,
      [userid]
    );

    res.json({ response1: response1.rows, response2: response2.rows });
  } catch (error) {
    console.error("Error fetching data for pie chart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/linecharts", async (req, res) => {
  const { userid } = req.body;

  try {
    const response = await pool.query(
      `SELECT 
      TRIM(TO_CHAR(date, 'Month')) AS month,
      SUM(amount) AS total_amount
  FROM 
      public.transactions
  WHERE 
      userid = $1
      AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY 
      TRIM(TO_CHAR(date, 'Month')), 
      DATE_TRUNC('month', date)
  ORDER BY 
      DATE_TRUNC('month', date);
  `,
      [userid]
    );

    res.status(200).json({ data: response.rows });
  } catch (error) {
    console.error("Error fetching data for pie chart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

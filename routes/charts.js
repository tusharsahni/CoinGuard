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
               AND userid = $1 AND show = true
             GROUP BY category`,
      [userid]
    );

    res.status(200).json({ data: response.rows });
  } catch (error) {
    console.error("Error fetching data for pie chart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/linecharts/", async (req, res) => {
    const { userid,categoryid } = req.body;
  
    try {
      const response = await pool.query(
        `SELECT category, SUM(amount) AS total_amount 
               FROM transactions 
               WHERE date >= DATE_TRUNC('month', CURRENT_DATE) 
                 AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' 
                 AND userid = $1 AND show = true
               GROUP BY category`,
        [userid]
      );
  
      res.status(200).json({ data: response.rows });
    } catch (error) {
      console.error("Error fetching data for pie chart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


module.exports = router;

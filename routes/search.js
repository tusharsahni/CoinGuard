const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("../db");

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.use(cors());
router.use(morgan("dev"));
router.use(express.json());

router.post("/categorysearch", async (req, res) => {
  const { userid } = req.body;
  if (!userid) {
    res.status(404).json({ message: "Keyword not found" });
  }
  try {
    const response = await pool.query(
      "SELECT * FROM transactions WHERE userid = $1 GROUP BY category",
      [userid]
    );
    res.status(200).json({ data: response.rows });
  } catch (err) {
    res.status(500).json({ message: "Server side error" });
  }
});

router.post("/datesearch", async (req, res) => {
  const { fromDate, toDate } = req.body;
  if (!fromDate || !toDate) {
    res.status(404).json({ message: "Dates not found" });
  }
  try {
    const response = await pool.query(
      "SELECT * FROM transactions WHERE date BETWEEN $1 and $2 AND show = TRUE",
      [fromDate, toDate]
    );
    res.status(200).json({ data: response.rows });
  } catch (err) {
    res.status(500).json({ message: "Server side error" });
  }
});

module.exports = router;

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
  const { userid, category } = req.body;
  if (!userid || !category) {
    res.status(404).json({ message: "Invalid input" });
  }
  try {
    const response = await pool.query(
      "SELECT id, name, category, amount, userid, TO_CHAR(date, 'DD-MM-YYYY') as date FROM transactions WHERE userid = $1 AND category= $2 ",
      [userid, category]
    );
    console.log("Hello");
    if (!response) {
      res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ data: response.rows });
  } catch (err) {
    res.status(500).json({ message: "Server side error" });
  }
});

router.post("/datesearch", async (req, res) => {
  const { startDate, endDate, userid } = req.body;
  console.log(startDate, endDate);
  if (!startDate || !endDate || !userid) {
    res.status(404).json({ message: "Dates not found" });
  }
  try {
    const response = await pool.query(
      "SELECT id, name, category, amount, userid, TO_CHAR(date, 'DD-MM-YYYY') as date FROM transactions WHERE date BETWEEN $1 and $2 AND userid = $3",
      [startDate, endDate, userid]
    );
    res.status(200).json({ data: response.rows });
  } catch (err) {
    res.status(500).json({ message: "Server side error" });
  }
});

module.exports = router;

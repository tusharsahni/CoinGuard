const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./db");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/namesearch", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    res.status(404).json({ message: "Keyword not found" });
  }
  try {
    const response = await pool.query(
      "SELECT * FROM transactions WHERE category = $1 AND show = TRUE",
      [keyword]
    );
    res.status(200).json({ data: response.rows });
  } catch (err) {
    res.status(500).json({ message: "Server side error" });
  }
});

app.post("/datesearch", async (req, res) => {
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
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("../db");

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.use(cors());
router.use(morgan("dev"));
router.use(express.json());

//RETRIEVAL
router.get("/transactions", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM transactions");
    res.json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//CREATION
router.post("/transactions", async (req, res) => {
  const { name,  date, category, amount } = req.body;

  //validate input fields
  if (!name  || !date || !category || !amount) {
    return res.status(400).json("All fields required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO transactions (name,  date, category, amount) VALUES ($1,  $2, $3, $4) RETURNING *",
      [name,  date, category, amount]
    );
    res.status(201).json({
      message: "Transaction Added Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Side error");
  }
});

//UPDATION
router.put("/transactions", async (req, res) => {
  
  const { name,  date, category, amount ,id} = req.body;

  //validate input fields
  if (
    !id ||
    !name ||
    !date ||
    !category ||
    !amount
  ) {
    return res.status(400).json("All fields required");
  }
  const result = await pool.query(
    "UPDATE transactions SET name = $1,  date = $2, category = $3, amount = $4 WHERE id = $5 RETURNING *",
    [name,  date, category, amount, id]
  );
  res.status(201).json({
    message: "Transaction updated successfully",
    data: result.rows[0],
  });
});

//DELETION
router.delete("/transactions", async (req, res) => {
  const { id } = req.body;

  //validate input fields
  try {
    if (!id) {
      return res.status(400).json("All fields required");
    }
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [id]
    );
    console.log(result);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(201).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server side error");
  }
});

module.exports = router;
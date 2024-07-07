const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./db");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//RETRIEVAL
app.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//CREATION
app.post("/transactions", async (req, res) => {
  const { name, type, date, category, amount } = req.body;

  //validate input fields
  if (!name || typeof type !== "boolean" || !date || !category || !amount) {
    return res.status(400).json("All fields required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO transactions (name, type, date, category, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, type, date, category, amount]
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
app.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, date, category, amount } = req.body;

  //validate input fields
  if (
    !id ||
    !name ||
    typeof type !== "boolean" ||
    !date ||
    !category ||
    !amount
  ) {
    return res.status(400).json("All fields required");
  }
  const result = await pool.query(
    "UPDATE transactions SET name = $1, type = $2, date = $3, category = $4, amount = $5 WHERE id = $6 RETURNING *",
    [name, type, date, category, amount, id]
  );
  res.status(201).json({
    message: "Transaction updated successfully",
    data: result.rows[0],
  });
});

//DELETION
app.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;

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
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("../db");

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.use(cors());
router.use(morgan("dev"));
router.use(express.json());

// Retrieve all categories
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories WHERE show = TRUE");
    res.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server side error");
  }
});

// Create a new category
router.post("/categories", async (req, res) => {
  const { user_id, name, amount, month, year } = req.body;

  // Validate input fields
  if (!user_id || !name || !amount || !month || !year) {
    return res.status(400).json("All fields required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (user_id, name, amount, month, year) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, name, amount, month, year]
    );
    res.status(201).json({
      message: "Category Added Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server side error");
  }
});
//UPDATE CATEGORIES
router.put("/categories", async (req,res) => {
    const { user_id,name, amount, month, year,category_id} = req.body;

  //validate input fields
  if (
    !user_id ||
    !name ||
    !amount ||
    !month ||
    !year ||
    !category_id
  ) {
    return res.status(400).json("All fields required");
  }
  const result = await pool.query(
    "UPDATE categories SET name = $1, amount = $2, month = $3, year = $4 WHERE category_id = $5 RETURNING *",
    [name, amount, month, year, category_id]
  );
  res.status(201).json({
    message: "Category updated successfully",
    data: result.rows[0],
  });
    
});
//DELETE 
router.delete("/transactions", async (req, res) => {
    const { category_id } = req.body;
  
    //validate input fields
    try {
      if (!id) {
        return res.status(400).json("All fields required");
      }
      const result = await pool.query(
        'UPDATE categories SET show = FALSE WHERE category_id = $1 RETURNING *',[id]
      );
      console.log(result);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(201).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json("Server side error");
    }
  });



  module.exports = router;  
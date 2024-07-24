const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("../db");
const PORT= process.env.PORT || 3000;
const router=express.Router();


router.use(cors());
router.use(morgan("dev"));
router.use(express.json());

//RETRIEVAL
router.post("/account", async (req, res) => {
   
   const {user_id} = req.body;
    try {
  
      const result = await pool.query("SELECT * FROM user_details WHERE user_id = $1", [user_id]);
      res.json({ data: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

router.post("/accountEmail", async (req, res) => {
   
   const {user_id} = req.body;
    try {
  
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
      res.json({ data: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

  

// UPDATE
router.put("/account", async (req, res) => {
    
    const {user_id , name, contact, country, gender,email} = req.body;

    // Validate input fields
    if (!name || !contact || !country || !gender) {
        return res.status(400).json("All fields required");
    }

    try {
        const User_detail_table = await pool.query(
            "UPDATE user_details SET name = $1, contact = $2, country = $3, gender = $4 WHERE user_id = $5 RETURNING *",
            [name, contact, country, gender, user_id]
        );
 
        if (User_detail_table.rows.length === 0) {
            return res.status(404).json("User not found");
        }


        const User_email = await pool.query("UPDATE users SET email = $1  WHERE user_id = $2 RETURNING *", [email,user_id]) ;

        if (User_email.rows.length === 0) {
          return res.status(404).json("User not found");
      }


        res.status(200).json({
            message: "User details updated successfully",
            data: User_detail_table.rows[0],
            data: User_email.rows[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

module.exports = router;
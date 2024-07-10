const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: "postgresql://devanshv:Pass123@localhost:5432/CoinGuard",
});

module.exports = pool;

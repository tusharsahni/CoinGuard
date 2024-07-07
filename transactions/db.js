const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: "postgresql://KuwarJ:Pass123@localhost:5432/CoinGuard",
});

module.exports = pool;

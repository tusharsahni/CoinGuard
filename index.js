const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

const app = express();

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

//routes
const accountRoutes = require("./routes/account");
const categoryRoutes = require("./routes/category");
const searchRoutes = require("./routes/search");
const transactionsRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");
const chartRoutes = require("./routes/charts");

app.use("/account", accountRoutes);
app.use("/category", categoryRoutes);
app.use("/search", searchRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/auth", authRoutes);
app.use("/charts", chartRoutes);
//start the port
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});

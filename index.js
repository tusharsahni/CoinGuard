const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const PORT = process.env.PORT || 3000;

const app = express();


//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static('public'));

//routes
const account = require('./routes/account');
const category = require('./routes/category');
const search = require('./routes/search');
const transactions = require('./routes/transactions');

app.use('/account',account);
app.use('/category',category);
app.use('/search',search);
app.use('/transactions',transactions);

//start the port
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
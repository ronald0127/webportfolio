const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 4001;

mongoose.connect("mongodb+srv://admin:admin@batch288repollo.jojjyon.mongodb.net/eCommerceAPI?retryWrites=true&w=majority",
{
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.on("error", console.error.bind(console, "Error encountered while connecting to the database!"));
mongoose.connection.once("open", () => console.log("Connected to the database: E-Commerce API."));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

app.listen(port, () => console.log(`Server is now running at port ${port}.`));

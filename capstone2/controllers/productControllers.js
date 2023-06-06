const Product = require("../models/Products.js");
const mongoose = require("mongoose");

module.exports.getAllProducts = (request, response) => {
	Product.find({}).then(result => {
		if (result.length !== 0) {
			return response.send(result);
		}
		else {
			return response.send("No products found.");
		}
	}).catch(error => response.send(error));
}

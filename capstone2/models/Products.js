const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name is required!"]
	},
	description: {
		type: String,
		required: [true, "Product description is required!"]
	},
	price: {
		type: Number,
		required: [true, "Product price is required!"]
	},
	category: {
		type: String,
		required: [true, "Product category is required!"]
	},
	clip: {
		type: String,
		required: [true, "Product clip is required!"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "Order user ID is required!"]
	},
	totalAmount: {
		type: Number,
		required: [true, "Order total amount is required!"]
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	},
	products: [
			{
				productId: {
					type: String,
					required: [true, "Order product ID is required!"]
				},
				quantity: {
					type: Number,
					required: [true, "Order product quantity is required!"]
				}
			}
		]
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

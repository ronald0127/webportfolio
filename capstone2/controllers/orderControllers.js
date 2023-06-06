const Order = require("../models/Orders.js");
const mongoose = require("mongoose");

module.exports.getAllOrders = (request, response) => {
	Order.find({}).then(result => {
		if (result.length !== 0) {
			return response.send(result);
		}
		else {
			return response.send("No orders found.");
		}
	}).catch(error => response.send(error));
}

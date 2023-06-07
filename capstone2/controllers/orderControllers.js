const Order = require("../models/Orders.js");
const Product = require("../models/Products.js");
const auth = require("../auth.js");
const mongoose = require("mongoose");

module.exports.getAllOrders = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		Order.find({}).then(result => {
			if (result.length > 0) {
				return response.send(result);
			}
			else {
				return response.send("No orders found.");
			}
		}).catch(error => response.send(error));
	}
	else {
		return response.send("Admin only! You don't have access to this route.");
	}
}

module.exports.createOrder = async (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if(userData.isAdmin) {
		return response.send("Users only! You don't have access to this route.");
	}
	else {
		const orderedProducts = request.body.orderedProducts;
		// Compute total amount of ordered products.
		const promises = orderedProducts.map(async product => {
			const subTotal = await Product.findById(product.productId).then(result => {
				if (!result.isActive) {
					return result.isActive;
				}
				else {
					return result.price * product.quantity;
				}
			}).catch(error => response.send(error));
			return subTotal;
		});

		const subTotals = await Promise.all(promises);

		if (subTotals.includes(false)) {
			return response.send("Cart has inactive product. Please double check and remove inactive products.");
		}
		else {
			const total = subTotals.reduce((a, b) => a + b, 0);
			new Order({
				userId: userData.id,
				totalAmount: total,
				products: orderedProducts
			}).save().then(result => response.send(`Order successfully created!`))
			.catch(error => response.send(error));
		}
	}
}

module.exports.seeMyOrders = async (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if(userData.isAdmin) {
		return response.send("Users only! You don't have access to this route.");
	}
	else {
		const ordersData = await Order.find({userId: userData.id}).then(result => {
			if (result.length > 0) {
				return result;
			}
			else {
				return false;
			}
		}).catch(error => response.send(error));

		if (!ordersData) {
			response.send("You don't have any orders yet.");
		}
		else {
			const promisesOuter = ordersData.map(async order => {
				const promises = order.products.map(async product => {
					const orderedProduct = await Product.findById(product.productId).then(result => {
						let productDetails = {
							name: result.name,
							quantity: product.quantity
						};
						return productDetails;
					}).catch(error => response.send(error));
					return orderedProduct;
				});

				const orderedProducts = await Promise.all(promises);

				let userOrders = {
					email: userData.email,
					totalAmount: order.totalAmount,
					purchasedOn: order.purchasedOn,
					products: orderedProducts
				};

				return userOrders;
			});

			const userOrdersArray = await Promise.all(promisesOuter);
			return response.send(userOrdersArray);
		}
	}
}

const Product = require("../models/Products.js");
const Order = require("../models/Orders.js");
const User = require("../models/Users.js");
const auth = require("../auth.js");
const mongoose = require("mongoose");

module.exports.getAllProducts = (request, response) => {
	if (auth.decode(request.headers.authorization).isAdmin) {
		Product.find({}).then(result => {
			if (result.length > 0) {
				return response.send(result);
			}
			else {
				return response.send(false);
			}
		}).catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.getAllActiveProducts = (request, response) => {
	Product.find({isActive: true}).then(result => {
		if (result.length > 0) {
			return response.send(result);
		}
		else {
			return response.send(false);
		}
	}).catch(error => response.send(false));
}

module.exports.getSingleProduct = (request, response) => {
	Product.findOne({_id: request.params.productId}).then(async result => {
		let resultReturn = {
			productDetails: result,
			orders: []
		};

		const ordersData = await Order.find({"products.productId": result._id}).then(result => {
			if (result.length > 0) {
				return result;
			}
			else {
				return false;
			}
		}).catch(error => response.send(false));

		if (ordersData !== false) {
			const promisesOrders = ordersData.map(async order => {
				const userEmail = await User.findById(order.userId)
				.then(result => result.email)
				.catch(error => response.send(false));

				const userOrders = {
					orderId: order._id,
					userId: order.userId,
					email: userEmail
				}

				return userOrders;
			});

			const userOrders = await Promise.all(promisesOrders);
			resultReturn.orders = userOrders;
		}

		return response.send(resultReturn);

	}).catch(error => response.send(false));
}

module.exports.addProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		new Product({
			name: request.body.name,
			description: request.body.description,
			price: request.body.price
		}).save().then(saved => response.send(true))
		.catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.updateProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		const productId = request.params.productId;
		Product.findByIdAndUpdate(productId, {
			name: request.body.name,
			description: request.body.description,
			price: request.body.price
		}).then(result => response.send(true))
		.catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.archiveProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		const productId = request.params.productId;
		Product.findByIdAndUpdate(productId, {isActive: false})
		.then(result => response.send(true))
		.catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.activateProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		const productId = request.params.productId;
		Product.findByIdAndUpdate(productId, {isActive: true})
		.then(result => response.send(true))
		.catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

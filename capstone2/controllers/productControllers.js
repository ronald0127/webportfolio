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
				return response.send("No products found.");
			}
		}).catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
	}
}

module.exports.getAllActiveProducts = (request, response) => {
	Product.find({isActive: true}).then(result => {
		if (result.length > 0) {
			return response.send(result);
		}
		else {
			return response.send("No active products found.");
		}
	}).catch(error => response.send(error));
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
		}).catch(error => response.send(error));

		if (ordersData !== false) {
			const promisesOrders = ordersData.map(async order => {
				const userEmail = await User.findById(order.userId)
				.then(result => result.email)
				.catch(error => response.send(error));

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

	}).catch(error => response.send(error));
}

module.exports.addProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		new Product({
			name: request.body.name,
			description: request.body.description,
			price: request.body.price
		}).save().then(saved => response.send("Product successfully created!"))
		.catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
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
		}).then(result => response.send(`Product ${productId} was successfully updated.`))
		.catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
	}
}

module.exports.archiveProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		const productId = request.params.productId;
		Product.findByIdAndUpdate(productId, {isActive: false})
		.then(result => response.send(`Product ${result.name} with ID ${productId} was successfully archived.`))
		.catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
	}
}

module.exports.activateProduct = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (userData.isAdmin) {
		const productId = request.params.productId;
		Product.findByIdAndUpdate(productId, {isActive: true})
		.then(result => response.send(`Product ${result.name} with ID ${productId} was successfully activated.`))
		.catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
	}
}

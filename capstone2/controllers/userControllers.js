const User = require("../models/Users.js");
const Order = require("../models/Orders.js");
const Product = require("../models/Products.js");
const auth = require("../auth.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports.registerUser = (request, response) => {
	let email = request.body.email;
	let password = request.body.password;
	if (email != '' && password != '') {
		User.findOne({email: email}).then(result => {
			if (result != null) {
				return response.send(false);
			}
			else {
				new User({
					email: email,
					password: bcrypt.hashSync(password, 10),
					firstName: request.body.firstName,
					lastName: request.body.lastName,
					mobileNumber: request.body.mobileNumber
				}).save()
				.then(saved => response.send(true))
				.catch(error => response.send(false));				
			}
		}).catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.loginUser = (request, response) => {
	let email = request.body.email;
	let password = request.body.password;
	User.findOne({email: email}).then(result => {
		if (result) {
			const isPasswordCorrect = bcrypt.compareSync(password, result.password);
			if (isPasswordCorrect) {
				return response.send({auth: auth.createAccessToken(result)});
			}
			else {
				return response.send(false);
			}
		}
		else {
			return response.send(false);
		}
	}).catch(error => response.send(false));
}

module.exports.userDetails = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	
	User.findOne({email: userData.email}).then(async result => {
		if (result) {
			result.password = "Confidential";
			let resultReturn = {
				userDetails: result,
				orders: []
			};

			const ordersData = await Order.find({userId: userData.id}).then(result => {
				if (result.length > 0) {
					return result;
				}
				else {
					return false;
				}
			}).catch(error => response.send(false));

			if (ordersData !== false) {
				const promisesOrders = ordersData.map(async order => {
					const promisesProducts = order.products.map(async product => {
						const orderedProduct = await Product.findById(product.productId).then(result => {
							let productDetails = {
								name: result.name,
								price: result.price,
								quantity: product.quantity,
								subTotal: result.price * product.quantity
							};
							return productDetails;
						}).catch(error => response.send(false));
						return orderedProduct;
					});

					const orderedProducts = await Promise.all(promisesProducts);

					let userOrders = {
						orderId: order._id,
						totalAmount: order.totalAmount,
						purchasedOn: order.purchasedOn,
						products: orderedProducts
					};

					return userOrders;
				});

				const userOrdersArray = await Promise.all(promisesOrders);
				resultReturn.orders = userOrdersArray;
			}
			
			return response.send(resultReturn);
		}
		else {
			return response.send(false);
		}
	}).catch(error => response.send(false));
}

module.exports.setUserAsAdmin = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	const email = request.body.email;

	if (userData.isAdmin) {
		User.findOneAndUpdate({email: email}, {isAdmin: true})
		.then(result => {
			if (result) {
				return response.send(true);
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

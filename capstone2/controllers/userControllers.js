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
				return response.send("This email is already registered, please use a new one.");
			}
			else {
				new User({
					email: email,
					password: bcrypt.hashSync(password, 10)
				}).save()
				.then(saved => response.send(`Email ${email} was successfully registered!`))
				.catch(error => response.send(error));				
			}
		}).catch(error => response.send(error));
	}
	else {
		return response.send("Both email and password must not be empty!");
	}
}

module.exports.loginUser = (request, response) => {
	let email = request.body.email;
	let password = request.body.password;
	User.findOne({email: email}).then(result => {
		if (result) {
			const isPasswordCorrect = bcrypt.compareSync(password, result.password);
			if (isPasswordCorrect) {
				return response.send(`Login successful!\n\nToken created: ${auth.createAccessToken(result)}`);
			}
			else {
				return response.send("Invalid password! Please check your password.");
			}
		}
		else {
			return response.send(`Email ${email} is not yet registered.`);
		}
	}).catch(error => response.send(error));
}

module.exports.userDetails = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if (!userData.isAdmin) {
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
				}).catch(error => response.send(error));

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
							}).catch(error => response.send(error));
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
				return response.send(`User ${userData.email} is not found.`);
			}
		}).catch(error => response.send(error));
	}
	else {
		return response.send("Users only! You don't have access to this route.");
	}
}

module.exports.setUserAsAdmin = (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	const email = request.body.email;

	if (userData.isAdmin) {
		User.findOneAndUpdate({email: email}, {isAdmin: true})
		.then(result => {
			if (result) {
				return response.send(`User ${email} is now an admin.`);
			}
			else {
				return response.send(`User ${email} not found.`);
			}
		}).catch(error => response.send(error));
	}
	else {
		return response.send("Admin Only! You don't have access to this route.");
	}
}

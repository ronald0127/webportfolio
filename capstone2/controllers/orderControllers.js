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
				return response.send(false);
			}
		}).catch(error => response.send(false));
	}
	else {
		return response.send(false);
	}
}

module.exports.createOrder = async (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if(userData.isAdmin) {
		return response.send(false);
	}
	else {
		new Order({
			userId: userData.id,
			totalAmount: request.body.totalAmount,
			products: request.body.orderedProducts
		}).save().then(result => response.send(true))
		.catch(error => response.send(false));

		// const orderedProducts = request.body.orderedProducts;
		// Compute total amount of ordered products.
		// const promises = orderedProducts.map(async product => {
		// 	const subTotal = await Product.findById(product.productId).then(result => {
		// 		if (!result.isActive) {
		// 			return result.isActive;
		// 		}
		// 		else {
		// 			return result.price * product.quantity;
		// 		}
		// 	}).catch(error => response.send(false));
		// 	return subTotal;
		// });

		// const subTotals = await Promise.all(promises);

		// if (subTotals.includes(false)) {
		// 	return response.send(false);
		// }
		// else {
		// 	const total = subTotals.reduce((a, b) => a + b, 0);
		// 	new Order({
		// 		userId: userData.id,
		// 		totalAmount: total,
		// 		products: orderedProducts
		// 	}).save().then(result => response.send(true))
		// 	.catch(error => response.send(false));
		// }
	}
}

module.exports.seeMyOrders = async (request, response) => {
	const userData = auth.decode(request.headers.authorization);
	if(userData.isAdmin) {
		return response.send(false);
	}
	else {
		const ordersData = await Order.find({userId: userData.id}).then(result => {
			if (result.length > 0) {
				return result;
			}
			else {
				return false;
			}
		}).catch(error => response.send(false));

		if (!ordersData) {
			response.send(false);
		}
		else {
			const promisesOrders = ordersData.map(async order => {
				const promisesProducts = order.products.map(async product => {
					const orderedProduct = await Product.findById(product.productId).then(result => {
						let productDetails = {
							productId: result._id,
							name: result.name,
							price: result.price,
							category: result.category,
							quantity: product.quantity,
							subTotal: product.subTotal,
							orderType: product.orderType
						};
						return productDetails;
					}).catch(error => response.send(false));
					return orderedProduct;
				});

				const orderedProducts = await Promise.all(promisesProducts);

				let userOrders = {
					orderId: order._id,
					email: userData.email,
					totalAmount: order.totalAmount,
					purchasedOn: order.purchasedOn,
					products: orderedProducts
				};

				return userOrders;
			});

			const userOrdersArray = await Promise.all(promisesOrders);
			return response.send(userOrdersArray);
		}
	}
}

module.exports.addProductsToCart = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		return response.send(false);
	}
	else {
		const orderId = request.params.orderId;
		const productId = request.body.productId;
		const productQty = request.body.quantity;

		Product.findById(productId).then(result => {
			const productPrice = result.price;
			if (result.isActive) {
				Order.findById(orderId).then(result => {
					let isItemInside = false;

					if (userData.id == result.userId) {
						result.products.forEach(product => {
							if (product.productId == productId) {
								isItemInside = true;
							}
						});

						if (!isItemInside) {
							result.products.push({
								productId: productId,
								quantity: productQty
							});
							result.totalAmount = result.totalAmount + (productPrice * productQty);

							result.save()
							.then(result => response.send(true))
							.catch(error => response.send(false));
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
			else {
				return response.send(false);
			}
		}).catch(error => response.send(false));
	}
}

module.exports.updateProductQuantity = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		return response.send(false);
	}
	else {
		const orderId = request.params.orderId;
		const productId = request.body.productId;
		const productQty = request.body.quantity;

		Product.findById(productId).then(result => {
			const productPrice = result.price;
			if (result.isActive) {
				Order.findById(orderId).then(result => {
					let isItemInside = false;
					let index = 0;

					if (userData.id == result.userId) {
						result.products.forEach(product => {
							if (product.productId == productId) {
								isItemInside = true;
								result.totalAmount = result.totalAmount - (productPrice * result.products[index].quantity);
								result.products[index].quantity = productQty;
								result.totalAmount = result.totalAmount + (productPrice * productQty);
							}
							index++;
						});

						if (isItemInside) {
							result.save()
							.then(result => response.send(true))
							.catch(error => response.send(false));
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
			else {
				return response.send(false);
			}
		}).catch(error => response.send(false));
	}
}

module.exports.removeItemToCart = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		return response.send(false);
	}
	else {
		const orderId = request.params.orderId;
		const productId = request.body.productId;

		Product.findById(productId).then(result => {
			const productPrice = result.price;
			Order.findById(orderId).then(result => {
				let isItemInside = false;
				let index = 0;

				if (userData.id == result.userId) {
					result.products.forEach(product => {
						if (product.productId == productId) {
							isItemInside = true;
							result.totalAmount = result.totalAmount - (productPrice * result.products[index].quantity);
							result.products.splice(index, 1);
						}
						index++;
					});

					if (isItemInside) {
						let addtnlMessage = ``;
						result.save().then(result => {
							if (result.products.length <= 0) {
								Order.findByIdAndRemove(orderId)
								.then(removed => addtnlMessage = `Order ${orderId} successfully removed.`)
								.catch(error => response.send(false));
							}
							return response.send(true);
						}).catch(error => response.send(false));
					}
					else {
						return response.send(false);
					}
				}
				else {
					return response.send(false);
				}
			}).catch(error => response.send(false));
		}).catch(error => response.send(false));
	}
}

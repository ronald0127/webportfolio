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
			const promisesOrders = ordersData.map(async order => {
				const promisesProducts = order.products.map(async product => {
					const orderedProduct = await Product.findById(product.productId).then(result => {
						let productDetails = {
							productId: result._id,
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
		return response.send("User only! You don't have access to this route.");
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
							.then(result => response.send("The item has been successfully added to your cart."))
							.catch(error => response.send(error));
						}
						else {
							return response.send("This item is already included to your cart. Please double check.");
						}
					}
					else {
						return response.send(`This order belongs to another user. Invalid orderId parameter in URL (${orderId}).`);
					}
				}).catch(error => response.send(error));
			}
			else {
				return response.send("This product is inactive / out of stock. Cannot add to cart.");
			}
		}).catch(error => response.send(error));
	}
}

module.exports.updateProductQuantity = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		return response.send("User only! You don't have access to this route.");
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
							.then(result => response.send("The item quantity has been successfully updated."))
							.catch(error => response.send(error));
						}
						else {
							return response.send("Item not found inside your cart. Please double check.");
						}
					}
					else {
						return response.send(`This order belongs to another user. Invalid orderId parameter in URL (${orderId}).`);
					}
				}).catch(error => response.send(error));
			}
			else {
				return response.send("This product is inactive / out of stock. Cannot add to cart.");
			}
		}).catch(error => response.send(error));
	}
}

module.exports.removeItemToCart = (request, response) => {
	const userData = auth.decode(request.headers.authorization);

	if (userData.isAdmin) {
		return response.send("User only! You don't have access to this route.");
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
						result.save().then(result => {
							if (result.products.length <= 0) {
								Order.findByIdAndRemove(orderId)
								.then(removed => console.log(`Order ${orderId} successfully removed.`))
								.catch(error => response.send(error));
							}
							return response.send("The item has been successfully deleted.");
						}).catch(error => response.send(error));
					}
					else {
						return response.send("Item not found inside your cart. Please double check.");
					}
				}
				else {
					return response.send(`This order belongs to another user. Invalid orderId parameter in URL (${orderId}).`);
				}
			}).catch(error => response.send(error));
		}).catch(error => response.send(error));
	}
}

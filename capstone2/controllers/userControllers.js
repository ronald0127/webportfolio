const User = require("../models/Users.js");
const auth = require("../auth.js")
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
	const userEmail = request.body.email;
	User.findOne({email: userEmail}).then(result => {
		if (result) {
			return response.send(result);
		}
		else {
			return response.send(`User ${userEmail} is not found.`);
		}
	}).catch(error => response.send(error));
}

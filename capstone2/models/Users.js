const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "User email is required!"]
	},
	password: {
		type: String,
		required: [true, "User password is required!"]
	},
	firstName: {
		type: String,
		required: [true, "User first name is required!"]
	},
	lastName: {
		type: String,
		required: [true, "User last name is required!"]
	},
	mobileNumber: {
		type: String,
		required: [true, "User number is required!"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;

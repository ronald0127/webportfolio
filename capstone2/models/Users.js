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
	isAdmin: {
		type: Boolean,
		default: false
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;

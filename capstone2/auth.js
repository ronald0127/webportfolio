const jwt = require("jsonwebtoken");
const secret = "eCommerceAPI_secretPhrase";

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(data, secret, {});
}

module.exports.verify = (request, response, next) => {
	let token = request.headers.authorization;

	if (token !== undefined) {
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (error, data) => {
			if (error) {
				return response.send("Authentication failed!");
			}
			else {
				next();
			}
		});
	}
	else {
		return response.send("No token provided!");
	}
}

module.exports.decode = (token) => {
	token = token.slice(7, token.length);
	return jwt.decode(token, {complete: true}).payload;
}

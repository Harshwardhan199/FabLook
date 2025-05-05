const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	UID: String,
	name: String,
	email: String,
	password: String,
	verified: Boolean
});

module.exports = mongoose.model('users', userSchema);
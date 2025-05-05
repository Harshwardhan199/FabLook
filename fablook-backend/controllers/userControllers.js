const User = require('../models/User');

const registerUser = async (req, res) => {
	console.log("Register Request body:", req.body);
	const { UID, name, email, password, verified } = req.body;

	const userExists = await User.findOne({ UID });
	if (userExists) {
		return res.status(200).json({ message: 'User already exists' });
	}

	const newUser = new User({ UID, name, email, password, verified });

	try {
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error registering user', error });
	}
};

const verifyUser = async (req, res) => {
	console.log("Verify Request body:", req.body);
	const { UID } = req.body;

	const userExists = await User.findOne({ UID });
	if (userExists) {
		await User.updateOne({ UID }, { $set: { verified: true } });
		return res.status(201).json({ message: 'Verification status updated Sucessfully' });
	}
	else {
		return res.status(400).json({ message: 'User not found' })
	}
};

const userHome = async (req, res) => {
	const { UID } = req.body;

	const user = await User.findOne({ UID });
	if (!user) return res.status(400).json({ message: 'User not found' });

	if (user.verified){
		res.status(200).json({ name: user.name });
	}
	else{
		return res.status(400).json({ message: 'User not verified' });
	}
};

module.exports = { registerUser, verifyUser, userHome };
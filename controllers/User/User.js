const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const userModel = require('../../Models/userModel');

exports.user = async (req, res, next) => {
	const email = req.params.email;
	const query = { email: email };
	const user = await userModel.findOne(query);
	let isAdmin = false;
	if (user?.role === 'admin') {
		isAdmin = true;
	}
	res.json({ admin: isAdmin });
};
exports.users = async (req, res, next) => {
	console.log('first');
	const user = req.body;
	const result = await userModel.save(user);
	res.json(result);
	console.log(result);
};
exports.userUpdate = async (req, res, next) => {
	console.log('second');
	const user = req.body;
	const filter = { email: user.email };
	const options = { upsert: true };
	const updateDoc = { $set: user };
	const result = await userModel.updateOne(filter, updateDoc, options);
	res.json(result);
};

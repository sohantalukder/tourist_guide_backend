const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const userModel = require('../../Models/userModel');

// Register a User
exports.adminLogin = async (req, res, next) => {
	const user = req.body;
	const requester = req.decodedEmail;
	if (requester) {
		const requesterAccount = await usersCollection.findOne({
			email: requester,
		});
		if (requesterAccount.role === 'admin') {
			const filter = { email: user.email };
			const updateDoc = { $set: { role: 'admin' } };
			const result = await usersCollection.updateOne(filter, updateDoc);
			res.json(result);
		}
	} else {
		res
			.status(401)
			.json({ message: 'You do not have permission to make admin' });
	}
};

exports.admin = async (req, res, next) => {
	const email = req.params.email;
	const query = { email: email };
	const user = await userModel.findOne(query);
	let isAdmin = false;
	if (user?.role === 'admin') {
		isAdmin = true;
	}
	res.json({ admin: isAdmin });
};

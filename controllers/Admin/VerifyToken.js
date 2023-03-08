const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
	if (req.headers?.authorization?.startsWith('Bearer ')) {
		const token = req.headers.authorization.split(' ')[1];
		try {
			const decodedUser = await admin.auth().verifyIdToken(token);
			req.decodedEmail = decodedUser.email;
		} catch (e) {}
	}
	next();
});

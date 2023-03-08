const General_Setting = require('../../Models/Settings/generalSettingModal');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ObjectID = require('mongoose').mongo.ObjectID;
exports.updateSetting = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;

	const {
		website_name,
		website_keywords,
		website_description,
		website_copyright,
	} = req.body;
	const filter = { _id: ObjectID(id) };
	const options = { upsert: true };
	const updatedDoc = {
		$set: {
			website_name: website_name,
			website_keywords: website_keywords,
			website_description: website_description,
			website_copyright: website_copyright,
			updateAt: Date.now(),
		},
	};

	const result = await General_Setting.updateOne(filter, updatedDoc, options);
	console.log(result);
	res.send(result);
});
// get update settings -- Admin
exports.generalSetting = catchAsyncErrors(async (req, res, next) => {
	const generalSetting = await General_Setting.find();

	res.status(200).json(generalSetting);
});

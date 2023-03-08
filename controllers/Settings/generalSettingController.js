import generalSettingModel from "../../Models/Settings/generalSettingModal.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
export const updateSetting = asyncHandler(async (req, res, next) => {
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

    const result = await generalSettingModel.updateOne(
        filter,
        updatedDoc,
        options
    );
    console.log(result);
    res.send(result);
});
// get update settings -- Admin
export const generalSetting = asyncHandler(async (req, res, next) => {
    const generalSetting = await generalSettingModel.find();

    res.status(200).json(generalSetting);
});

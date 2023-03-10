import mongoose from "mongoose";
const generalSettingSchema = new mongoose.Schema({
    generalSetting: {
        website_name: {
            type: String,
            max: 25,
            required: true,
        },
        website_keywords: {
            type: String,
            max: "255",
            required: true,
        },

        website_description: {
            type: String,
            max: "1200",
            required: true,
        },

        website_copyright: {
            type: String,
            max: "255",
            required: true,
        },
        // user: {
        // 	// type: Number,
        // 	// required: true,
        // 	// default: 0,
        // },
        updateAt: {
            type: Date,
            default: Date.now,
        },
    },
});

const generalSettingModel = mongoose.model(
    "General_Setting",
    generalSettingSchema
);
export default generalSettingModel;

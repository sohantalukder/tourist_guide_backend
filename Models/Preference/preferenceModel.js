import mongoose from "mongoose";
const preferencesSchema = new mongoose.Schema({
    generalSetting: {
        website_name: {
            type: String,
            max: 25,
            required: true,
            default: "Tourist Guide",
        },
        website_keywords: {
            type: Array,
        },
        website_description: {
            type: String,
            max: "1200",
            required: true,
            default: null,
        },
        website_copyright: {
            type: String,
            max: "255",
            required: true,
            default: null,
        },
        blackLogo: {
            type: String,
            default: null,
        },
        whiteLogo: {
            type: String,
            default: null,
        },
        facebookURL: {
            type: String,
            default: null,
        },
        youtubeURL: {
            type: String,
            default: null,
        },
        twitterURL: { type: String, default: null },
        whatsapp: { type: String, default: null },
        linkedinURL: { type: String, default: null },
        pinterestURL: { type: String, default: null },
        instagramURL: { type: String, default: null },
        githubURL: { type: String, default: null },
        primaryContactNumber: { type: String, default: null },
        secondaryContactNumber: { type: String, default: null },
        primaryEmail: { type: String, default: null },
        secondaryEmail: { type: String, default: null },
        address: { type: String, default: null },
        updateAt: {
            type: Date,
            default: Date.now,
        },
    },
});

const Preferences = mongoose.model("Preferences", preferencesSchema);
export default Preferences;

import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
const updatePreference = asyncHandler(async (req, res) => {
    try {
        const {
            website_name,
            website_keywords,
            website_description,
            website_copyright,
            facebookURL,
            youtubeURL,
            whatsapp,
            pinterestURL,
            instagramURL,
            githubURL,
            primaryContactNumber,
            secondaryContactNumber,
            primaryEmail,
            secondaryEmail,
            address,
        } = req.body;
        const images = req.files;
        console.log(images);
    } catch (error) {
        res.status(400).json(response({ code: 400, message: error.message }));
    }
});

export { updatePreference };

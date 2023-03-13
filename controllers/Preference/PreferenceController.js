import asyncHandler from "express-async-handler";
import Preferences from "../../Models/Preference/preferenceModel.js";
import getDataURI from "../../utlis/dataUri.js";

import { response } from "../../utlis/generateResponse.js";
import cloudinary from "cloudinary";
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
        // const logo = req.files;
        console.log(req.files);
        const preference = await Preferences.findOne();
        // if (logo?.size / 1000000 <= 2) {
        //     const imageURI = await getDataURI(logo);
        //     const cloudImage = await cloudinary.v2.uploader.upload(
        //         imageURI.content
        //     );
        //     preference.website_name = website_name || preference.website_name;
        //     preference.website_keywords =
        //         website_keywords || preference.website_keywords;
        //     preference.website_description =
        //         website_description || preference.website_description;
        //     preference.website_copyright =
        //         website_copyright || preference.website_copyright;
        //     preference.facebookURL = facebookURL || preference.facebookURL;
        //     preference.youtubeURL = youtubeURL || preference.youtubeURL;
        //     preference.whatsapp = whatsapp || preference.whatsapp;
        //     preference.pinterestURL = pinterestURL || preference.pinterestURL;
        //     preference.instagramURL = instagramURL || preference.instagramURL;
        //     preference.githubURL = githubURL || preference.githubURL;
        //     preference.primaryContactNumber =
        //         primaryContactNumber || preference.primaryContactNumber;
        //     preference.secondaryContactNumber =
        //         secondaryContactNumber || preference.secondaryContactNumber;
        //     preference.primaryEmail = primaryEmail || preference.primaryEmail;
        //     preference.secondaryEmail =
        //         secondaryEmail || preference.secondaryEmail;
        //     preference.address = address || preference.address;
        //     preference.logo = cloudImage.secure_url || preference.logo;
        //     await preference.save();
        //     res.status(200).json(
        //         response({
        //             code: 200,
        //             message: "Successfully updated preference!",
        //         })
        //     );
        // } else {
        //     res.status(400).json(
        //         response({
        //             code: 400,
        //             message:
        //                 "Profile image size must be less than or equal to 2 MB",
        //         })
        //     );
        // }
    } catch (error) {
        res.status(400).json(response({ code: 400, message: error.message }));
    }
});

export { updatePreference };

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
        const logos = req.files;
        let blackLogoResult, whiteLogoResult;
        if (logos?.length > 0) {
            const blackLogo = logos.find(
                (logo) => logo?.fieldname === "blackLogo"
            );
            const whiteLogo = logos.find(
                (logo) => logo?.fieldname === "whiteLogo"
            );
            if (blackLogo) {
                const blackLogoURI = await getDataURI(blackLogo);
                blackLogoResult = await cloudinary.v2.uploader.upload(
                    blackLogoURI.content
                );
            }
            if (whiteLogo) {
                const whiteLogoURI = await getDataURI(whiteLogo);
                whiteLogoResult = await cloudinary.v2.uploader.upload(
                    whiteLogoURI.content
                );
            }
        }
        const preference = await Preferences.findOne();
        preference.website_name = website_name || preference.website_name;
        preference.website_keywords =
            website_keywords || preference.website_keywords;
        preference.website_description =
            website_description || preference.website_description;
        preference.website_copyright =
            website_copyright || preference.website_copyright;
        preference.facebookURL = facebookURL || preference.facebookURL;
        preference.youtubeURL = youtubeURL || preference.youtubeURL;
        preference.whatsapp = whatsapp || preference.whatsapp;
        preference.pinterestURL = pinterestURL || preference.pinterestURL;
        preference.instagramURL = instagramURL || preference.instagramURL;
        preference.githubURL = githubURL || preference.githubURL;
        preference.primaryContactNumber =
            primaryContactNumber || preference.primaryContactNumber;
        preference.secondaryContactNumber =
            secondaryContactNumber || preference.secondaryContactNumber;
        preference.primaryEmail = primaryEmail || preference.primaryEmail;
        preference.secondaryEmail = secondaryEmail || preference.secondaryEmail;
        preference.address = address || preference.address;
        preference.blackLogo =
            blackLogoResult?.secure_url || preference.blackLogo;
        preference.whiteLogo =
            whiteLogoResult?.secure_url || preference.whiteLogo;
        await preference.save();
        res.status(200).json(
            response({
                code: 200,
                message: "Successfully updated preference!",
            })
        );
    } catch (error) {
        res.status(500).json(response({ code: 500, message: error.message }));
    }
});

export { updatePreference };

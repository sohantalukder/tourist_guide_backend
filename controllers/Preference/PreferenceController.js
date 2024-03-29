import asyncHandler from "express-async-handler";
import Preferences from "../../Models/Preference/preferenceModel.js";
import getDataURI from "../../utlis/dataUri.js";

import { response } from "../../utlis/generateResponse.js";
import cloudinary from "cloudinary";
import { getImageName } from "../../utlis/getImageName.js";
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
            linkedinURL,
            twitterURL,
        } = req.body;
        const logos = req.files;
        let blackLogoResult, whiteLogoResult;
        const preference = await Preferences.findOne();
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
                    blackLogoURI.content,
                    { public_id: blackLogo?.originalname?.split(".")[0] }
                );
                if (blackLogoResult?.secure_url) {
                    cloudinary.v2.uploader.destroy(
                        getImageName(preference.blackLogo)
                    );
                }
            }
            if (whiteLogo) {
                const whiteLogoURI = await getDataURI(whiteLogo);
                whiteLogoResult = await cloudinary.v2.uploader.upload(
                    whiteLogoURI.content,
                    { public_id: whiteLogo?.originalname?.split(".")[0] }
                );
                if (whiteLogoResult?.secure_url) {
                    cloudinary.v2.uploader.destroy(
                        getImageName(preference.whiteLogo)
                    );
                }
            }
        }
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
        preference.linkedinURL = linkedinURL || preference.linkedinURL;
        preference.twitterURL = twitterURL || preference.twitterURL;
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
        return res.status(200).json(
            response({
                code: 200,
                message: "Successfully updated preference!",
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const getPreference = asyncHandler(async (req, res) => {
    const preference = await Preferences.findOne({});

    if (!preference) {
        return res
            .status(500)
            .json(response({ code: 500, message: "Internal Server Error!" }));
    }

    const {
        website_name,
        website_keywords,
        website_description,
        website_copyright,
        blackLogo,
        whiteLogo,
        address,
        facebookURL,
        youtubeURL,
        twitterURL,
        whatsapp,
        linkedinURL,
        pinterestURL,
        instagramURL,
        githubURL,
        primaryContactNumber,
        secondaryContactNumber,
        primaryEmail,
        secondaryEmail,
    } = preference;

    const records = {
        website_name,
        website_keywords,
        website_description,
        website_copyright,
        logos: {
            blackLogo,
            whiteLogo,
        },
        address,
        facebookURL,
        youtubeURL,
        twitterURL,
        whatsapp,
        linkedinURL,
        pinterestURL,
        instagramURL,
        githubURL,
        primaryContactNumber,
        secondaryContactNumber,
        primaryEmail,
        secondaryEmail,
    };

    return res.status(200).json(
        response({
            code: 200,
            message: "Ok",
            records,
        })
    );
});

export { updatePreference, getPreference };

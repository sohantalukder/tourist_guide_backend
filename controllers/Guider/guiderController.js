import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
import Guider from "../../Models/Guiders/guidersModel.js";
import User from "../../Models/User/userModel.js";
import getDataURI from "../../utlis/dataUri.js";
import cloudinary from "cloudinary";
import { getImageName } from "../../utlis/getImageName.js";

const addGuider = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        gender,
        locateArea,
        location,
        languages,
        contactNumber,
        email,
        price,
        pricePer,
        currencyAccept,
    } = req.body;
    const files = req.files;
    try {
        const user = await User.findOne({ email });
        const image = files.find((image) => image.fieldname === "profileImage");
        const images = files.filter(
            (image) => image.fieldname !== "profileImage"
        );
        let profile;
        let allImages = [];
        if (image) {
            const imageURI = await getDataURI(image);
            profile = await cloudinary.v2.uploader.upload(imageURI.content, {
                public_id: image?.originalname?.split(".")[0],
            });
        }
        if (images?.length > 0) {
            for (let image of images) {
                const imageURI = await getDataURI(image);
                const cloudImage = await cloudinary.v2.uploader.upload(
                    imageURI.content,
                    {
                        public_id: image?.originalname?.split(".")[0],
                    }
                );
                allImages.push(cloudImage.secure_url);
            }
        }
        console.log(allImages);
        if (user) {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "Already you are a user!",
                })
            );
        }
        await Guider.create({
            name,
            description,
            gender,
            profileImage: profile?.secure_url,
            images: allImages,
            locateArea,
            location,
            languages,
            contactNumber,
            email,
            price,
            pricePer,
            currencyAccept,
            createdAt: Date.now(),
        });

        return res.status(201).json(
            response({
                code: 201,
                message: "Successfully added guider!",
            })
        );
    } catch (err) {
        console.log(err.message);
        if (err.code == "11000") {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "Please use different email or contact number!",
                })
            );
        } else {
            return res.status(500).json(
                response({
                    code: 500,
                    message: err.message,
                })
            );
        }
    }
});
const deleteGuider = async (req, res) => {
    const guider = await Guider.findById(req.params.id);

    if (!guider) {
        return res.status(422).json(
            response({
                code: 422,
                message: "Guider doesn't exist!",
            })
        );
    }
    if (guider.email !== req.user.email) {
        return res.status(422).json(
            response({
                code: 422,
                message: "You are not eligible to delete this guider!",
            })
        );
    }

    try {
        await guider.remove();
        const imageName = getImageName(guider?.profileImage);
        if (imageName) {
            cloudinary.v2.uploader.destroy(imageName);
        }

        for (let image of guider.images || []) {
            const imageName = getImageName(image);
            if (imageName) {
                cloudinary.v2.uploader.destroy(imageName);
            }
        }
        return res.status(200).json(
            response({
                code: 200,
                message: "Successfully deleted guider!",
            })
        );
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
};

export { addGuider, deleteGuider };

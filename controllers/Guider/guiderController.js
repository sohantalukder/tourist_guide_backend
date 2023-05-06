import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
import Guiders from "../../Models/Guiders/guidersModel.js";
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
        const image = files?.find(
            (image) => image.fieldname === "profileImage"
        );
        const images = files?.filter(
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
        if (user) {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "Already you are a user!",
                })
            );
        }
        await Guiders.create({
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
const deleteGuider = asyncHandler(async (req, res) => {
    const guider = await Guiders.findById(req.params.id);

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
});
const updateGuiderInfo = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            description,
            gender,
            locateArea,
            location,
            languages,
            contactNumber,
            price,
            pricePer,
            currencyAccept,
            updateImagesIndex,
            deleteImagesIndex,
        } = req.body;
        const files = req.files;
        const guider = await Guiders.findOne({ _id: req.params.id });
        if (!guider) {
            return res.status(404).json(
                response({
                    code: 404,
                    message: "Unable to find guider. Please try again!",
                })
            );
        }
        if (!(req.user.email != guider.email || req.user.role === "admin")) {
            return res.status(401).json(
                response({
                    code: 401,
                    message: "You are not able to update guider details.",
                })
            );
        }
        const profileImage = files?.find(
            (image) => image.fieldname === "profileImage"
        );
        if (profileImage) {
            const imageURI = await getDataURI(profileImage);
            const cloudImage = await cloudinary.v2.uploader.upload(
                imageURI.content
            );

            if (cloudImage?.secure_url) {
                await cloudinary.v2.uploader.destroy(
                    getImageName(guider?.profileImage)
                );
            }

            guider.profileImage = cloudImage.secure_url || guider.profileImage;
        }
        const images = files?.filter(
            (image) => image.fieldname !== "profileImage"
        );
        if (images?.length > 0) {
            for (const [index, file] of images.entries()) {
                const imagePath = await getDataURI(file);
                const cloudImage = await cloudinary.v2.uploader.upload(
                    imagePath.content,
                    {
                        public_id: file?.originalname?.split(".")[0],
                    }
                );

                if (updateImagesIndex?.includes(index)) {
                    if (
                        cloudImage?.secure_url !==
                        getImageName(guider.images[updateImagesIndex[index]])
                    ) {
                        await cloudinary.v2.uploader.destroy(
                            getImageName(
                                guider.images[updateImagesIndex[index]]
                            )
                        );
                    }

                    guider.images[updateImagesIndex[index]] =
                        cloudImage.secure_url;
                } else {
                    guider.images.push(cloudImage.secure_url);
                }
            }
        }

        if (deleteImagesIndex?.length > 0) {
            for (const index of deleteImagesIndex) {
                await cloudinary.v2.uploader.destroy(
                    getImageName(guider.images[index])
                );
                guider.images.splice(index, 1);
            }
        }

        guider.name = name || guider.name;
        guider.description = description || guider.description;
        guider.gender = gender || guider.gender;
        guider.locateArea = locateArea || guider.locateArea;
        guider.location = location || guider.location;
        guider.contactNumber = contactNumber || guider.contactNumber;
        guider.languages = languages || guider.languages;
        guider.price = price || guider.price;
        guider.pricePer = pricePer || guider.pricePer;
        guider.currencyAccept = currencyAccept || guider.currencyAccept;
        await guider.save();

        return res.status(200).json(
            response({
                code: 200,
                message: "Successfully updated guider information!",
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
});
const getGuiderDetails = asyncHandler(async (req, res) => {
    const guider = await Guiders.findById(req.params.id);
    try {
        if (guider) {
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Ok",
                    records: {
                        id: guider._id,
                        name: guider.name,
                        contactNumber: guider.contactNumber,
                        email: guider.email,
                        gender: guider.gender,
                        profileImage: guider.profileImage,
                        images: guider.images,
                        locateArea: guider.locateArea,
                        location: guider.location,
                        languages: guider.languages,
                        price: guider.price,
                        pricePerHour: guider.pricePer,
                        currencyAccept: guider.currencyAccept,
                    },
                })
            );
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "Guider not found!" }));
        }
    } catch (err) {
        return res
            .status(500)
            .json(response({ code: 500, message: err.message }));
    }
});
const allGuiders = asyncHandler(async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const sortbyID = { _id: -1 };
        const sortByRating = { react: -1 };
        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};

        const count = await Guiders.countDocuments({ ...keyword });
        const guiders = await Guiders.find({ ...keyword })
            .sort(sortByRating)
            .sort(sortbyID)
            .skip(pageSize * (page - 1));
        const manipulateGuiders = (guiders) => {
            return guiders?.length > 0
                ? guiders.map((guider) => {
                      return {
                          id: guider._id,
                          name: guider.name,
                          contactNumber: guider.contactNumber,
                          email: guider.email,
                          gender: guider.gender,
                          profileImage: guider.profileImage,
                          images: guider.images,
                          locateArea: guider.locateArea,
                          location: guider.location,
                          languages: guider.languages,
                          price: guider.price,
                          pricePerHour: guider.pricePer,
                          currencyAccept: guider.currencyAccept,
                      };
                  })
                : [];
        };
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    guiders: manipulateGuiders(guiders),
                    PageNumber: page,
                    Pages: Math.ceil(count / pageSize),
                },
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
export {
    addGuider,
    deleteGuider,
    updateGuiderInfo,
    getGuiderDetails,
    allGuiders,
};

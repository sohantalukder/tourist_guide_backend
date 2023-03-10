import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import User from "../../Models/User/userModel.js";
import getDataURI from "../../utlis/dataUri.js";
import { response } from "../../utlis/generateResponse.js";
import Events from "../../Models/Events/eventsModel.js";
const createEvent = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            description,
            eventCover,
            price,
            person,
            pickUpLocation,
            destinationLocation,
            guide,
            busServices,
            startDate,
            endDate,
        } = req.body;
        const image = req.file;
        console.log(Object.keys(image)?.length > 0);
        const creatorId = req.user._id;
        const user = await User.findById(creatorId);
        if (user) {
            if (image?.size / 1000000 <= 2) {
                const imageURI = await getDataURI(image);
                const cloudImage = await cloudinary.v2.uploader.upload(
                    imageURI.content
                );
                await Events.create({
                    name,
                    description,
                    eventCover,
                    price,
                    person,
                    pickUpLocation,
                    destinationLocation,
                    guide: guide ? true : false,
                    busServices: busServices ? true : false,
                    startDate,
                    endDate,
                    image: cloudImage.secure_url,
                    creatorId,
                });
                res.status(200).json(
                    response({
                        code: 200,
                        message: "Successfully created event",
                    })
                );
            } else {
                res.status(404).json(
                    response({
                        code: 404,
                        message:
                            "Profile image size must be less than or equal to 2 MB",
                    })
                );
            }
        } else {
            res.status(404).json(
                response({
                    code: 404,
                    message: "User are not valid user for create event",
                })
            );
        }
    } catch (error) {
        res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
});

export { createEvent };

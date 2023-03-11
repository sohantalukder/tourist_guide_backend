import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import getDataURI from "../../utlis/dataUri.js";
import { response } from "../../utlis/generateResponse.js";
import Events from "../../Models/Events/eventsModel.js";
import User from "../../Models/User/userModel.js";
const createEvent = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            description,
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
        const creatorId = req.user._id;
        if (image?.size / 1000000 <= 2) {
            const imageURI = await getDataURI(image);
            const cloudImage = await cloudinary.v2.uploader.upload(
                imageURI.content
            );
            await Events.create({
                name,
                description,
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
    } catch (error) {
        res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
});
const updateEventInfo = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            person,
            pickUpLocation,
            destinationLocation,
            guide,
            busServices,
            startDate,
            endDate,
        } = req.body;
        const event = await Events.findOne({ _id: req.params.id });
        const image = req.file;
        if (event) {
            if (req.user._id == event.creatorId) {
                if (image?.size / 1000000 <= 2 || !image) {
                    if (image) {
                        const imageURI = await getDataURI(image);
                        const cloudImage = await cloudinary.v2.uploader.upload(
                            imageURI.content
                        );
                        event.image = cloudImage.secure_url || event.image;
                    }
                    event.name = name || event.name;
                    event.description = description || event.description;
                    event.price = price || event.price;
                    event.person = person || event.person;
                    event.pickUpLocation =
                        pickUpLocation || event.pickUpLocation;
                    event.destinationLocation =
                        destinationLocation || event.destinationLocation;
                    event.guide = guide || event.guide;
                    event.busServices = busServices || event.busServices;
                    event.startDate = startDate || event.startDate;
                    event.endDate = endDate || event.endDate;
                    await event.save();
                    res.status(200).json(
                        response({
                            code: 200,
                            message: "Successfully updated event information!",
                        })
                    );
                } else {
                    res.status(400).json(
                        response({
                            code: 400,
                            message:
                                "Profile image size must be less than or equal to 2 MB",
                        })
                    );
                }
            } else {
                res.status(400).json(
                    response({
                        code: 400,
                        message: "You are not able update events details.",
                    })
                );
            }
        } else {
            res.status(404).json(
                response({
                    code: 404,
                    message: "Event Not Found!",
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
const eventDetails = asyncHandler(async (req, res) => {
    const event = await Events.findById(req.params.id);
    const creator = await User.findOne({ _id: event.creatorId });
    if (event) {
        res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    id: event._id,
                    name: event.name,
                    creatorId: event.creatorId,
                    createName: creator.name,
                    creatorEmail: creator.email,
                    createImage: creator.image,
                    description: event.description,
                    price: event.price,
                    person: event.person,
                    pickUpLocation: event.pickUpLocation,
                    destinationLocation: event.destinationLocation,
                    image: event.image,
                    guide: event.guide,
                    busServices: event.busServices,
                    startDate: event.startDate,
                    endDate: event.endDate,
                },
            })
        );
    } else {
        res.status(404).json(
            response({ code: 404, message: "Event not found!" })
        );
    }
});
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Events.findById(req.params.id);
    if (event) {
        if (event.creatorId == req.user._id) {
            await event.remove();
            res.status(200).json(
                response({ code: 200, message: "Event deleted Successfully" })
            );
        } else {
            res.status(404).json(
                response({
                    code: 404,
                    message: "You are not able delete this event",
                })
            );
        }
    } else {
        res.status(404).json(
            response({ code: 404, message: "Event not found!" })
        );
    }
});
export { createEvent, updateEventInfo, eventDetails, deleteEvent };

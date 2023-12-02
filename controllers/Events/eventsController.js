import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import getDataURI from "../../utlis/dataUri.js";
import { response } from "../../utlis/generateResponse.js";
import Events from "../../Models/Events/eventsModel.js";
import { getImageName } from "../../utlis/getImageName.js";
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
        const image = req.files[0];
        const creator = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            image: req.user.image,
        };
        const imageURI = await getDataURI(image);
        const cloudImage = await cloudinary.v2.uploader.upload(
            imageURI.content,
            { public_id: image?.originalname?.split(".")[0] }
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
            creator,
        });
        return res.status(201).json(
            response({
                code: 201,
                message: "Successfully created event",
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
        const image = req.files[0];
        if (event) {
            if (req.user._id == event.creator.id || req.user.role === "admin") {
                if (image) {
                    const imageURI = await getDataURI(image);
                    const cloudImage = await cloudinary.v2.uploader.upload(
                        imageURI.content
                    );
                    if (cloudImage?.secure_url) {
                        cloudinary.v2.uploader.destroy(
                            getImageName(event?.image)
                        );
                    }
                    event.image = cloudImage.secure_url || event.image;
                }
                event.name = name || event.name;
                event.description = description || event.description;
                event.price = price || event.price;
                event.person = person || event.person;
                event.pickUpLocation = pickUpLocation || event.pickUpLocation;
                event.destinationLocation =
                    destinationLocation || event.destinationLocation;
                event.guide = guide || event.guide;
                event.busServices = busServices || event.busServices;
                event.startDate = startDate || event.startDate;
                event.endDate = endDate || event.endDate;
                await event.save();
                return res.status(200).json(
                    response({
                        code: 200,
                        message: "Successfully updated event information!",
                    })
                );
            } else {
                return res.status(401).json(
                    response({
                        code: 401,
                        message: "You are not able update events details.",
                    })
                );
            }
        } else {
            return res.status(404).json(
                response({
                    code: 404,
                    message: "Event Not Found!",
                })
            );
        }
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
const eventDetails = asyncHandler(async (req, res) => {
    const event = await Events.findById(req.params.id);
    if (event) {
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    id: event._id,
                    name: event.name,
                    creator: event.creator,
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
        return res
            .status(404)
            .json(response({ code: 404, message: "Event not found!" }));
    }
});
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Events.findById(req.params.id);
    if (event) {
        if (event.creator.id == req.user._id || req.user.role === "admin") {
            event.remove();
            if (event?.image) {
                cloudinary.v2.uploader.destroy(getImageName(event?.image));
            }
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Event deleted Successfully",
                })
            );
        } else {
            return res.status(404).json(
                response({
                    code: 404,
                    message: "You are not able delete this event",
                })
            );
        }
    } else {
        return res
            .status(404)
            .json(response({ code: 404, message: "Event not found!" }));
    }
});
const allEvents = asyncHandler(async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const sortbyID = { _id: -1 };
        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};

        const count = await Events.countDocuments({ ...keyword });
        const events = await Events.find(
            { ...keyword },
            {
                _id: 1,
                name: 1,
                creator: 1,
                description: 1,
                price: 1,
                person: 1,
                pickUpLocation: 1,
                destinationLocation: 1,
                image: 1,
                guide: 1,
                busServices: 1,
                startDate: 1,
                endDate: 1,
            }
        )
            .sort(sortbyID)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    data: events,
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
export { createEvent, updateEventInfo, eventDetails, deleteEvent, allEvents };

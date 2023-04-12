import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
import Guider from "../../Models/Guiders/guidersModel.js";
import User from "../../Models/User/userModel.js";

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
    console.log(files);
    try {
        const user = await User.findOne({ email });
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
export { addGuider };

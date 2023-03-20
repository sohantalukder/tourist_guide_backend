import asyncHandler from "express-async-handler";
import Divisions from "../../Models/Locations/divisions.js";
import { response } from "../../utlis/generateResponse.js";

const addDivision = asyncHandler(async (req, res) => {
    try {
        const { name, code, geocode } = req.body;
        await Divisions.create({
            name,
            division_code: code,
            geocode,
            createdAt: Date.now(),
        });
        res.status(201).json(
            response({
                code: 201,
                message: "Successfully add division!",
            })
        );
    } catch (error) {
        res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});

export { addDivision };

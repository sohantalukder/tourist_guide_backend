import asyncHandler from "express-async-handler";
import Divisions from "../../Models/Locations/divisions.js";
import { response } from "../../utlis/generateResponse.js";

const addDivision = asyncHandler(async (req, res) => {
    const { name, code, geocode } = req.body;
    try {
        const division = await Divisions.findOne({ division_code: code });
        if (division) {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "This division has already been added!",
                })
            );
        }
        await Divisions.create({
            name,
            division_code: code,
            geocode,
            createdAt: Date.now(),
        });

        return res.status(201).json(
            response({
                code: 201,
                message: "Successfully added division!",
            })
        );
    } catch (err) {
        return res.status(500).json(
            response({
                code: 500,
                message: err.message,
            })
        );
    }
});
const editDivision = asyncHandler(async (req, res) => {
    const id = req.params.code;
    const { name, code, geocode } = req.body;
    try {
        const division = await Divisions.findOneAndUpdate(
            { division_code: id },
            { name, division_code: code, geocode, updatedAt: Date.now() },
            { new: true }
        );
        if (division) {
            return res.status(202).json(
                response({
                    code: 202,
                    message: "Successfully division updated!",
                })
            );
        }
        return res.status(404).json(
            response({
                code: 404,
                message: "Division not found!",
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
const deleteDivision = asyncHandler(async (req, res) => {
    try {
        const id = req.params.code;
        const division = await Divisions.findOne({ division_code: id });
        if (division) {
            await division.remove();
            res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully division deleted!",
                })
            );
        } else {
            res.status(422).json(
                response({
                    code: 422,
                    message: "Division doesn't exits!",
                })
            );
        }
    } catch (error) {
        res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});

const addDistrict = asyncHandler(async (req, res) => {
    const { name, division_code, district_code, geocode } = req.body;
    try {
        const division = await Divisions.findOne({
            division_code: division_code,
        });
        if (!division) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "Division doesn't exits!",
                })
            );
        }
        const district = division?.districts.find(
            (district) => district?.district_code === district_code
        );
        if (district) {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "This district has already been added!",
                })
            );
        }
        const newDistrict = {
            name,
            division_code,
            district_code,
            geocode,
            createdAt: Date.now(),
        };
        division.districts.push(newDistrict);
        await division.save();
        return res
            .status(201)
            .json(
                response({ code: 201, message: "Successfully district added!" })
            );
    } catch (err) {
        return res.status(500).json(
            response({
                code: 500,
                message: err.message,
            })
        );
    }
});
export { addDivision, editDivision, deleteDivision, addDistrict };

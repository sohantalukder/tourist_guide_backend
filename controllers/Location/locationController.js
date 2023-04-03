import asyncHandler from "express-async-handler";
import Divisions from "../../Models/Locations/divisions.js";
import { response } from "../../utlis/generateResponse.js";

const addDivision = asyncHandler(async (req, res) => {
    const { name, code, geocode } = req.body;
    try {
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
        if (err.code == "11000") {
            return res.status(409).json(
                response({
                    code: 409,
                    message: "This division has already been added!",
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
            return res.status(200).json(
                response({
                    code: 200,
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
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully division deleted!",
                })
            );
        }
        return res.status(422).json(
            response({
                code: 422,
                message: "Division doesn't exits!",
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
const allDivisions = asyncHandler(async (req, res) => {
    try {
        const sortbyID = { _id: -1 };
        const divisions = await Divisions.find().sort(sortbyID);
        const manipulateDivisions = (divisions) => {
            return divisions?.length > 0
                ? divisions.map((division) => {
                      return {
                          divisionCode: division.division_code,
                          name: division.name,
                      };
                  })
                : [];
        };
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: manipulateDivisions(divisions),
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
const updateDistrict = asyncHandler(async (req, res) => {
    const { name, division_code, district_code, geocode } = req.body;
    const { code, districtCode } = req.params;
    try {
        const division = await Divisions.findOne({ division_code: code });
        if (!division) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "Division doesn't exits!",
                })
            );
        }
        const { districts } = division;
        const index = districts.findIndex(
            (district) => district?.district_code == districtCode
        );
        if (index === -1) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "Unable to find this district!",
                })
            );
        }
        districts[index] = {
            name: name || districts[index]?.name,
            division_code: division_code || districts[index]?.district_code,
            district_code: district_code || districts[index]?.district_code,
            geocode: geocode || districts[index]?.geocode,
            updatedAt: Date.now(),
        };
        await division.save();
        return res.status(200).json(
            response({
                code: 200,
                message: "Successfully district updated!",
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
const allDistricts = asyncHandler(async (req, res) => {
    try {
        const division = await Divisions.findOne({
            division_code: req.params.code,
        });
        const manipulateDistricts = (districts) => {
            return districts?.length > 0
                ? districts
                      .map((district) => {
                          return {
                              name: district.name,
                              division_code: district.division_code,
                              district_code: district.district_code,
                              geocode: district.geocode,
                          };
                      })
                      .sort(function (a, b) {
                          if (a.district_code < b.district_code) {
                              return -1;
                          }
                          if (a.district_code > b.district_code) {
                              return 1;
                          }
                          return 0;
                      })
                : [];
        };
        if (!division) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "Select valid division!",
                })
            );
        }
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: manipulateDistricts(division?.districts),
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
const deleteDistrict = asyncHandler(async (req, res) => {
    try {
        const { code, districtCode } = req.params;
        const division = await Divisions.findOne({ division_code: code });
        if (!division) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "Division doesn't exits!",
                })
            );
        }
        const index = division?.districts.findIndex(
            (district) => district?.district_code == districtCode
        );
        if (index === -1) {
            return res.status(422).json(
                response({
                    code: 422,
                    message: "District doesn't exits!",
                })
            );
        }
        division?.districts.splice(index, 1);
        await division.save();
        return res.status(200).json(
            response({
                code: 200,
                message: "District successfully deleted!",
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
const addSubDistrict = asyncHandler(async (req, res) => {
    const { name, division_code, district_code, postalCode, geocode } =
        req.body;
    const division = await Divisions.findOne({ division_code }).exec();
    if (!division) {
        return res.status(422).json(
            response({
                code: 422,
                message: "Division doesn't exist!",
            })
        );
    }
    const district = division.districts.find(
        (district) => district.district_code === district_code
    );
    if (!district) {
        return res.status(422).json(
            response({
                code: 422,
                message: "District doesn't exist!",
            })
        );
    }
    const upazila = district.upazilas.find(
        (upazila) => upazila.postalCode === postalCode
    );
    if (upazila) {
        return res.status(409).json(
            response({
                code: 409,
                message: "This upzila is already created!",
            })
        );
    }
    district.upazilas.push({
        name,
        postalCode,
        geocode,
        createdAt: Date.now(),
    });
    await division.save();
    return res.status(201).json(
        response({
            code: 201,
            message: "Successfully added upazila!",
        })
    );
});

export {
    addDivision,
    editDivision,
    deleteDivision,
    addDistrict,
    allDivisions,
    updateDistrict,
    allDistricts,
    deleteDistrict,
    addSubDistrict,
};

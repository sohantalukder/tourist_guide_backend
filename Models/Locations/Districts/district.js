import mongoose from "mongoose";
import Upazilas from "./Upazilas/upazilas.js";

const Districts = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    division_code: {
        type: Number,
        required: true,
    },
    district_code: {
        type: Number,
        required: true,
        unique: true,
    },
    geocode: {
        type: String,
        required: false,
        default: null,
    },
    upazilas: [Upazilas],
    createdAt: Date,
    updatedAt: Date,
});

export default Districts;

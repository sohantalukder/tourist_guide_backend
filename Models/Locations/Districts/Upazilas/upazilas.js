import mongoose from "mongoose";

const Upazilas = mongoose.Schema({
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
    },
    postalCode: {
        type: Number,
        required: true,
    },
    geocode: {
        type: String,
        required: false,
        default: null,
    },
    createdAt: Date,
    updatedAt: Date,
});

export default Upazilas;

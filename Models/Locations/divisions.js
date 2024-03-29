import mongoose from "mongoose";
import Districts from "./Districts/district.js";

const divisionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    division_code: {
        type: Number,
        required: true,
        unique: true,
    },
    geocode: {
        type: String,
        required: false,
        default: null,
    },
    districts: [Districts],
    createdAt: Date,
    updatedAt: Date,
});

const Divisions = mongoose.model("divisions", divisionSchema);
export default Divisions;

import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        startDate: { type: String, required: true },
        payment: { type: Boolean, default: false },
        endData: { type: String, required: true },
        location: { type: String, required: true },
        comment: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
export default eventSchema;

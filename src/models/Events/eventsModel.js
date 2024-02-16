import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    creator: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
    },
    name: { type: String, required: true },
    description: {
        type: String,
        required: true,
        default: null,
    },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    person: { type: Number, required: true },
    pickUpLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    guide: { type: Boolean, default: false },
    busServices: { type: Boolean, default: false },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Events = mongoose.model("events", eventSchema);

export default Events;

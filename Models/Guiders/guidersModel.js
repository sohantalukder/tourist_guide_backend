import mongoose from "mongoose";

const guidersSchema = mongoose.Schema({
    guidersID: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    description: {
        type: String,
        required: true,
        default: null,
    },
    images: { type: Array, default: null },
    profileImage: { type: String, default: null },
    gender: { type: String, default: "Male" },
    guideIn: { type: String, default: null },
    languages: { type: Array, default: ["Bangla", "English"] },
    price: { type: Number, default: null },
    pricePer: { type: String, default: "Hour" },
    currencyAccept: { type: Array, default: ["BDT", "USA"] },
    rating: { type: Number, default: 0 },
    feedBack: ["ads"],
    tourCalender: ["ads"],
    available: { type: Boolean, default: True },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Guiders = mongoose.model("guiders", guidersSchema);

export default Guiders;

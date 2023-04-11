import mongoose from "mongoose";

const guiderSchema = new mongoose.Schema({
    guidersID: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    images: { type: [String], default: null },
    profileImage: { type: String, default: null },
    gender: { type: String, default: "Male" },
    guideIn: { type: String, default: null },
    languages: { type: [String], default: ["Bangla", "English"] },
    price: { type: Number, default: null },
    pricePer: { type: String, default: "Hour" },
    currencyAccept: { type: [String], default: ["BDT", "USA"] },
    rating: { type: Number, default: 0 },
    feedBack: [
        {
            userId: { type: String },
            userName: { type: String },
            userImage: { type: String, default: Null },
            comment: {
                type: String,
                maxLength: [
                    255,
                    "Comment description cannot exceed 255 characters",
                ],
            },
            createAt: { type: Date, default: Date.now },
        },
    ],
    totalTour: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
});

const Guider = mongoose.model("guiders", guiderSchema);

export default Guider;

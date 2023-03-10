import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
    {
        image: { type: String, required: false },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        commentUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "commentUser",
        },
    },
    {
        timestamps: true,
    }
);

export default blogSchema;

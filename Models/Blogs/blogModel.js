import mongoose from "mongoose";
import commentSchema from "./Comments/CommentsSchema.js";
const blogSchema = mongoose.Schema({
    creatorId: {
        type: String,
        required: true,
        default: null,
    },
    image: { type: String, default: null },
    description: {
        type: String,
        required: true,
        default: null,
        maxLength: [1200, "Description cannot exceed 1200 characters"],
    },
    react: { type: Number, required: true, default: 0 },
    comments: { commentSchema },
    createAt: { type: Date, default: Date.now },
});

export default blogSchema;

import mongoose from "mongoose";
import commentSchema from "./Comments/CommentsSchema.js";
const blogSchema = mongoose.Schema({
    creatorId: {
        type: String,
        required: true,
        default: null,
    },
    creatorName: {
        type: String,
        default: null,
    },
    creatorLocation: {
        type: String,
    },
    creatorImage: { type: String },
    title: {
        type: String,
        default: null,
        maxLength: [255, "Title cannot exceed 255 characters"],
    },
    images: { type: Array, default: null },
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

const Blog = mongoose.model("blogs", blogSchema);
export default Blog;

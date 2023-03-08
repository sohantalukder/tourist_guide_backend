import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
    {
        image: { type: String, required: false },
        userInfo: { type: Object, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        commentUser: { type: Object, required: true },
    },
    {
        timestamps: true,
    }
);

export default blogSchema;

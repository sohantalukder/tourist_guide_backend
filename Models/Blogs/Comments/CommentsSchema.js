import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    commentatorId: { type: String, required: true },
    like: { type: Number, default: 0 },
    comment: {
        type: String,
        required: true,
        maxLength: [255, "Comment description cannot exceed 255 characters"],
    },
    createAt: { type: Date, default: Date.now },
});

export default commentSchema;

import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    commentatorId: { type: String },
    commentatorName: { type: String },
    like: { type: Number, default: 0 },
    comment: {
        type: String,
        maxLength: [255, "Comment description cannot exceed 255 characters"],
    },
    createAt: { type: Date, default: Date.now },
});

export default commentSchema;

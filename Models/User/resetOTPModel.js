import mongoose from "mongoose";

const resetOTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: Date,
    expiredAt: Date,
    expiredToken: {
        type: Date,
        default: null,
    },
});

const resetOtp = mongoose.model("resetOtp", resetOTPSchema);
export default resetOtp;

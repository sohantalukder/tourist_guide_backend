import mongoose from "mongoose";

const otpVerificationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createAt: Date,
    expiredAt: Date,
});

const UserOptVerification = mongoose.model(
    "userOptVerification",
    otpVerificationSchema
);
export default UserOptVerification;

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
    createdAt: Date,
    expiredAt: Date,
});

const UserOtpVerification = mongoose.model(
    "userOtpVerification",
    otpVerificationSchema
);
export default UserOtpVerification;

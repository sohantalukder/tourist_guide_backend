import asyncHandler from "express-async-handler";
import User from "../../Models/User/userModel.js";
import { response } from "../../utlis/generateResponse.js";
import generateToken from "../../utlis/generateToken.js";
import nodemailer from "nodemailer";
import UserOptVerification from "../../Models/User/otpVerificationModel.js";
import { emailTemplate } from "../../utlis/emailTemplate.js";
import UserOtpVerification from "../../Models/User/otpVerificationModel.js";
let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: "tourists.guides2@gmail.com",
        pass: "1KrAdqIWQwzGt3Jp",
    },
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.comparePassword(password))) {
        if (!user.emailVerify) {
            sendOTPVerificationEmail({ user, res });
        } else {
            res.status(200).json(
                response({
                    code: 200,
                    message: "ok",
                    records: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        emailVerify: user.emailVerify,
                        fvtFoods: user.fvtFoods,
                        fvtPlace: user.fvtPlace,
                        status: user.status,
                        role: user.role,
                        image: user.image,
                        location: user.location,
                        contactNumber: user.contactNumber,
                        description: user.description,
                        token: generateToken(user._id),
                    },
                })
            );
        }
    } else {
        res.status(401).json(
            response({ code: 401, message: "Invalid email or password" })
        );
    }
});

const duplicateEmailCheck = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(401).json(
            response({ code: 401, message: "User already is already taken" })
        );
    } else {
        res.status(200).json(
            response({ code: 200, message: "This email available" })
        );
    }
});

const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if (name === "" || email === "" || password === "") {
        res.status(401).json(
            response({ code: 401, message: "Empty input fields!" })
        );
    } else if (!/^[a-zA-z ]*$/.test(name)) {
        res.status(401).json(
            response({ code: 401, message: "Invalid name entered!" })
        );
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(401).json(
            response({ code: 401, message: "Invalid email entered!" })
        );
    } else if (password.length < 8) {
        res.status(401).json(
            response({ code: 401, message: "Password is too short!" })
        );
    } else {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(401).json(
                response({ code: 401, message: "User already exits" })
            );
        } else {
            const user = await User.create({
                name,
                email,
                password,
            });
            if (user) {
                sendOTPVerificationEmail({
                    user,
                    res,
                });
            } else {
                res.status(401).json(
                    response({ code: 401, message: "Invalid user data" })
                );
            }
        }
    }
});

//send otp verification email
const sendOTPVerificationEmail = async ({ user, res }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const mailOptions = {
            from: '"Tourist Guide" <tourists.guides2@gmail.com>',
            to: user.email,
            subject: "One-time verification code",
            text: "Welcome to Tourist Guide",
            html: emailTemplate({ otp }),
        };
        const newOTPVerification = await new UserOptVerification({
            userId: user._id,
            otp: otp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3000000,
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.status(202).json(
            response({
                code: 202,
                message: "Verification OTP sent to your email!",
                records: {
                    id: user._id,
                    userStatus: user.status,
                    emailVerify: user.emailVerify,
                    token: generateToken(user._id),
                },
            })
        );
    } catch (error) {
        res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
};

const verifyOTP = asyncHandler(async (req, res) => {
    try {
        const { otp } = req.body;
        if (!req.user._id || !otp) {
            res.status(401).json(
                response({
                    code: 401,
                    message: "Empty otp details are not allowed",
                })
            );
        } else {
            const userOtpVerificationRecords = await UserOtpVerification.find({
                userId: req.user._id,
            });
            if (
                !userOtpVerificationRecords ||
                userOtpVerificationRecords <= 0
            ) {
                res.status(401).json(
                    response({
                        code: 401,
                        message:
                            "Account record doesn't exit or has been verified already. Please sign up or log in",
                    })
                );
            } else {
                const { expiredAt, otp: recordOtp } =
                    userOtpVerificationRecords[0];
                if (expiredAt < Date.now()) {
                    await UserOptVerification.deleteMany({
                        userId: req.user._id,
                    });
                    res.status(401).json(
                        response({
                            code: 401,
                            message: "Code has expired. Please request again!",
                        })
                    );
                } else {
                    const validOtp = otp === recordOtp;
                    if (!validOtp) {
                        res.status(401).json(
                            response({
                                code: 401,
                                message:
                                    "Invalid code passed. Check your inbox!",
                            })
                        );
                    } else {
                        const getUser = await User.findOne({
                            _id: req.user._id,
                        });
                        getUser.emailVerify = true;
                        const updatedUser = await getUser.save();
                        res.status(201).json(
                            response({
                                code: 201,
                                message: "User email verified successfully",
                                records: {
                                    id: updatedUser._id,
                                    name: updatedUser.name,
                                    email: updatedUser.email,
                                    emailVerify: updatedUser.emailVerify,
                                    fvtFoods: updatedUser.fvtFoods,
                                    fvtPlace: updatedUser.fvtPlace,
                                    status: updatedUser.status,
                                    role: updatedUser.role,
                                    image: updatedUser.image,
                                    location: updatedUser.location,
                                    contactNumber: updatedUser.contactNumber,
                                    description: updatedUser.description,
                                    token: generateToken(updatedUser._id),
                                },
                            })
                        );
                    }
                }
            }
        }
    } catch (error) {
        res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    fvtFoods: user.fvtFoods,
                    fvtPlace: user.fvtPlace,
                    status: user.status,
                    role: user.role,
                    image: user.image,
                    location: user.location,
                    contactNumber: user.contactNumber,
                    description: user.description,
                },
            })
        );
    } else {
        res.status(404).json(response(404, "User not found!", []));
    }
});
const resendVerifyOTP = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne(req.user._id);
        if (user && !user.emailVerify) {
            await UserOptVerification.deleteOne({
                userId: req.user._id,
            });
            sendOTPVerificationEmail({ user, res });
        } else {
            res.status(401).json(
                response({
                    code: 401,
                    message:
                        "Please resend OTP to your email with valid user details",
                })
            );
        }
    } catch (error) {
        res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const {
        name,
        image,
        fvtFoods,
        fvtPlace,
        location,
        contactNumber,
        description,
    } = req.body || {};
    if (user) {
        if (description?.length >= 50 && description?.length <= 300) {
            user.name = name || user.name;
            user.image = image || user.image;
            user.fvtFoods = fvtFoods || user.fvtFoods;
            user.fvtPlace = fvtPlace || user.fvtPlace;
            user.location = location || user.location;
            user.contactNumber = contactNumber || user.contactNumber;
            await user.save();
            res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully updated profile information!",
                })
            );
        } else {
            res.status(400).json(
                response({
                    code: 400,
                    message:
                        "Description not grater than 300 characters and not smaller than 50 characters!",
                })
            );
        }
    } else {
        res.status(404).json(
            response({ code: 404, message: "User not found!" })
        );
    }
});

export {
    authUser,
    duplicateEmailCheck,
    registerUser,
    verifyOTP,
    resendVerifyOTP,
    updateUserProfile,
    getUser,
};

import asyncHandler from "express-async-handler";
import User from "../../Models/User/userModel.js";
import { response } from "../../utlis/generateResponse.js";
import generateToken from "../../utlis/generateToken.js";
import nodemailer from "nodemailer";
import cloudinary from "cloudinary";
import UserOptVerification from "../../Models/User/otpVerificationModel.js";
import { emailTemplate } from "../../utlis/emailTemplate.js";
import UserOtpVerification from "../../Models/User/otpVerificationModel.js";
import getDataURI from "../../utlis/dataUri.js";
import { resetPasswordEmailTemplate } from "../../utlis/resetPasswordEmailTemplate.js";
import resetOtp from "../../Models/User/resetOTPModel.js";

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
                        res.status(200).json(
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
        res.status(404).json(
            response({ code: 404, message: "User not found!" })
        );
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
    const { name, fvtFoods, fvtPlace, location, contactNumber, description } =
        req.body || {};
    if (user) {
        if (description?.length >= 50 && description?.length <= 300) {
            user.name = name || user.name;
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
            res.status(401).json(
                response({
                    code: 401,
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
const uploadProfileImage = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const image = req.files[0];
            const imageURI = await getDataURI(image);
            const cloudImage = await cloudinary.v2.uploader.upload(
                imageURI.content
            );
            user.image = cloudImage.secure_url || user.image;
            await user.save();
            res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully updated profile picture!",
                })
            );
        } else {
            res.status(404).json(
                response({ code: 404, message: "User not found!" })
            );
        }
    } catch (error) {
        res.status(404).json(response({ code: 404, message: error.message }));
    }
});
const changePassword = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;
        if (user) {
            if (await user.comparePassword(oldPassword)) {
                user.password = newPassword;
                await user.save();
                res.status(200).json(
                    response({
                        code: 200,
                        message: "Successfully changed your password",
                    })
                );
            } else {
                res.status(401).json(
                    response({
                        code: 401,
                        message: "Your old password doesn't match!",
                    })
                );
            }
        } else {
            res.status(404).json(
                response({ code: 404, message: "User not found!" })
            );
        }
    } catch (error) {
        res.status(400).json(
            response({
                code: 400,
                message: error.message,
            })
        );
    }
});
const sendOTPResetPassword = async ({ user, res }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const mailOptions = {
            from: '"Tourist Guide" <tourists.guides2@gmail.com>',
            to: user.email,
            subject: "One-time Reset OTP code",
            html: resetPasswordEmailTemplate({
                otp,
                name: user.name,
                email: user.email,
            }),
        };
        const newRestOTP = await new resetOtp({
            email: user.email,
            otp: otp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3000000,
        });
        await newRestOTP.save();
        await transporter.sendMail(mailOptions);
        res.status(202).json(
            response({
                code: 202,
                message: "Reset OTP sent to your email!",
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
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            sendOTPResetPassword({
                user,
                res,
            });
        } else {
            res.status(404).json(
                response({ code: 404, message: "User not found!" })
            );
        }
    } catch (error) {
        res.status(400).json(response({ code: 400, message: error.message }));
    }
});

const verifyResetPassword = asyncHandler(async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!email || !otp) {
            res.status(401).json(
                response({
                    code: 401,
                    message: "Empty otp details are not allowed",
                })
            );
        } else {
            const otpForResetPassword = await resetOtp.find({
                email: email,
            });
            if (!otpForResetPassword || otpForResetPassword <= 0) {
                res.status(401).json(
                    response({
                        code: 401,
                        message:
                            "Account record doesn't exit or has been password reset already. Please sign up or log in",
                    })
                );
            } else {
                const { expiredAt, otp: recordOtp } = otpForResetPassword[0];
                if (expiredAt < Date.now()) {
                    await resetOtp.deleteMany({
                        email: email,
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
                        (otpForResetPassword[0].expiredToken =
                            Date.now() + 3000000),
                            await otpForResetPassword[0].save();
                        res.status(200).json(
                            response({
                                code: 200,
                                message: "User email verified successfully",
                                records: {
                                    token: generateToken(email),
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
const storeResetPassword = asyncHandler(async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            res.json(400).json(
                response({ code: 400, message: "Please enter password!" })
            );
        } else {
            const resetOTP = await resetOtp.find({ email: req.user.email });
            if (!resetOTP || resetOTP <= 0) {
                res.status(401).json(
                    response({
                        code: 401,
                        message:
                            "Account record doesn't exit or has been password reset already. Please sign up or log in",
                    })
                );
            } else {
                const { expiredToken } = resetOTP[0];
                if (expiredToken < Date.now()) {
                    await resetOtp.deleteMany({
                        email: req.user.email,
                    });
                    res.status(401).json(
                        response({
                            code: 401,
                            message: "Code has expired. Please request again!",
                        })
                    );
                } else {
                    const getUser = await User.findOne({
                        email: req.user.email,
                    });
                    getUser.password = password;
                    await getUser.save();
                    res.status(200).json(
                        response({
                            code: 200,
                            message: "Successfully reset password!",
                        })
                    );
                }
            }
        }
    } catch (error) {
        res.json(400).json(response({ code: 400, message: error.message }));
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
    uploadProfileImage,
    changePassword,
    resetPassword,
    verifyResetPassword,
    storeResetPassword,
};

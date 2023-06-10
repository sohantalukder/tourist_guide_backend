import asyncHandler from "express-async-handler";
import User from "../../Models/User/userModel.js";
import { response } from "../../utlis/generateResponse.js";
import generateToken from "../../utlis/generateToken.js";
import cloudinary from "cloudinary";
import UserOptVerification from "../../Models/User/otpVerificationModel.js";
import { emailTemplate } from "../../utlis/emailTemplate.js";
import UserOtpVerification from "../../Models/User/otpVerificationModel.js";
import getDataURI from "../../utlis/dataUri.js";
import { resetPasswordEmailTemplate } from "../../utlis/resetPasswordEmailTemplate.js";
import resetOtp from "../../Models/User/resetOTPModel.js";
import { getImageName } from "../../utlis/getImageName.js";
import { transporter } from "../../config/SMTP_Config.js";

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
        const {
            _id,
            name,
            email,
            emailVerify,
            fvtFoods,
            fvtPlace,
            status,
            role,
            image,
            location,
            contactNumber,
            description,
        } = user;

        if (!emailVerify) {
            return (
                res.status(202).json(
                    response({
                        code: 202,
                        message: "Verify your account!",
                        records: {
                            id: _id,
                            userStatus: status,
                            emailVerify: emailVerify,
                            token: generateToken(_id),
                        },
                    })
                ),
                sendOTPVerificationEmail({
                    user,
                    res,
                })
            );
        } else {
            const message = "ok";
            const code = 200;

            const responseObj = response({
                code,
                message,
                records: {
                    id: _id,
                    name,
                    email,
                    emailVerify,
                    fvtFoods,
                    fvtPlace,
                    status,
                    role,
                    image,
                    location,
                    contactNumber,
                    description,
                    token: generateToken(_id),
                },
            });

            return res.status(code).json(responseObj);
        }
    } else {
        return res
            .status(401)
            .json(
                response({ code: 401, message: "Invalid email or password" })
            );
    }
});

const duplicateEmailCheck = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(401).json(
            response({
                code: 401,
                message: "User already is already taken",
            })
        );
    } else {
        return res
            .status(200)
            .json(response({ code: 200, message: "This email available" }));
    }
});

const registerUser = asyncHandler(async (req, res) => {
    try {
        let { name, email, password } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();

        switch (true) {
            case name === "" || email === "" || password === "":
                return res
                    .status(400)
                    .json(
                        response({ code: 400, message: "Empty input fields!" })
                    );
            case !name:
                return res.status(400).json(
                    response({
                        code: 400,
                        message: "Entered Name!",
                    })
                );
            case !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email):
                return res
                    .status(400)
                    .json({ error: "Invalid email entered!" });
            case password.length < 6:
                return res.status(400).json(
                    response({
                        code: 400,
                        message: "Password is too short!",
                    })
                );
            default:
                break;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res
                .status(409)
                .json(response({ code: 409, message: "User already exits" }));
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        if (!user) {
            return res
                .status(400)
                .json(response({ code: 400, message: "Invalid user data" }));
        }
        return (
            res.status(201).json(
                response({
                    code: 201,
                    message: "Successfully Registration!",
                    records: {
                        id: user._id,
                        userStatus: user.status,
                        emailVerify: user.emailVerify,
                        token: generateToken(user._id),
                    },
                })
            ),
            sendOTPVerificationEmail({
                user,
                res,
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});

//send otp verification email
const sendOTPVerificationEmail = async ({ user, res }) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
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
        await transporter().sendMail(mailOptions);
    } catch (error) {
        return res.status(401).json(
            response({
                code: 401,
                message: error.message,
            })
        );
    }
};

const verifyOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (!req.user._id || !otp) {
        return res.status(401).json(
            response({
                code: 401,
                message: "Empty otp details are not allowed",
            })
        );
    }

    const userOtpVerificationRecords = await UserOtpVerification.find({
        userId: req.user._id,
    });

    if (
        !userOtpVerificationRecords ||
        userOtpVerificationRecords.length === 0
    ) {
        return res.status(401).json(
            response({
                code: 401,
                message:
                    "Account record doesn't exist or has been verified already. Please sign up or log in",
            })
        );
    }

    const { expiredAt, otp: recordOtp } =
        userOtpVerificationRecords[userOtpVerificationRecords?.length - 1];

    if (expiredAt < Date.now()) {
        await UserOtpVerification.deleteMany({
            userId: req.user._id,
        });

        return res.status(401).json(
            response({
                code: 401,
                message: "Code has expired. Please request again!",
            })
        );
    }
    const validOtp = otp === recordOtp;

    if (!validOtp) {
        return res.status(401).json(
            response({
                code: 401,
                message: "Invalid code passed. Check your inbox!",
            })
        );
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { emailVerify: true },
        { new: true }
    );

    return res.status(200).json(
        response({
            code: 200,
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
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        return res.status(200).json(
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
    }
    return res
        .status(404)
        .json(response({ code: 404, message: "User not found!" }));
});
const resendVerifyOTP = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user && !user.emailVerify) {
            await UserOptVerification.deleteOne({
                userId: req.user._id,
            });
            return (
                res.status(200).json(
                    response({
                        code: 200,
                        message: "OTP send to your email!",
                    })
                ),
                sendOTPVerificationEmail({ user, res })
            );
        } else {
            return res.status(401).json(
                response({
                    code: 401,
                    message:
                        "Please resend OTP to your email with valid user details",
                })
            );
        }
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
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
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully updated profile information!",
                })
            );
        } else {
            return res.status(401).json(
                response({
                    code: 401,
                    message:
                        "Description not grater than 300 characters and not smaller than 50 characters!",
                })
            );
        }
    } else {
        return res
            .status(404)
            .json(response({ code: 404, message: "User not found!" }));
    }
});
const uploadProfileImage = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const image = req.files[0];
            const imageURI = await getDataURI(image);
            const cloudImage = await cloudinary.v2.uploader.upload(
                imageURI.content,
                { public_id: image?.originalname?.split(".")[0] }
            );
            if (cloudImage?.secure_url) {
                cloudinary.v2.uploader.destroy(getImageName(user?.image));
            }
            user.image = cloudImage.secure_url || user.image;
            await user.save();
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Successfully updated profile picture!",
                })
            );
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "User not found!" }));
        }
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const changePassword = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        if (user) {
            if (await user.comparePassword(oldPassword)) {
                user.password = newPassword;
                await user.save();
                return res.status(200).json(
                    response({
                        code: 200,
                        message: "Successfully changed your password",
                    })
                );
            } else {
                return res.status(401).json(
                    response({
                        code: 401,
                        message: "Your old password doesn't match!",
                    })
                );
            }
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "User not found!" }));
        }
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
const sendOTPResetPassword = async ({ user, res }) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
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
        return res.status(202).json(
            response({
                code: 202,
                message: "Reset OTP sent to your email!",
            })
        );
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
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
            return res
                .status(404)
                .json(response({ code: 404, message: "User not found!" }));
        }
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});

const verifyResetPassword = asyncHandler(async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!email || !otp) {
            return res.status(401).json(
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
                return res.status(401).json(
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
                    return res.status(401).json(
                        response({
                            code: 401,
                            message: "Code has expired. Please request again!",
                        })
                    );
                } else {
                    const validOtp = otp === recordOtp;
                    if (!validOtp) {
                        return res.status(401).json(
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
                        return res.status(200).json(
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
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
const storeResetPassword = asyncHandler(async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res
                .json(400)
                .json(
                    response({ code: 400, message: "Please enter password!" })
                );
        } else {
            const resetOTP = await resetOtp.find({ email: req.user.email });
            if (!resetOTP || resetOTP <= 0) {
                return res.status(401).json(
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
                    return res.status(401).json(
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
                    return res.status(200).json(
                        response({
                            code: 200,
                            message: "Successfully reset password!",
                        })
                    );
                }
            }
        }
    } catch (error) {
        return res
            .json(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const loginWithGoogle = asyncHandler(async (req, res) => {
    const { email, name, picture, email_verified } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                emailVerify: email_verified,
                image: picture,
            });
        } else {
            user.name = name;
            user.emailVerify = email_verified;
            user.image = picture;

            await user.save();
        }

        return res.status(200).json(
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
                    googleLogin: true,
                    token: generateToken(user._id),
                },
            })
        );
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
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
    uploadProfileImage,
    changePassword,
    resetPassword,
    verifyResetPassword,
    storeResetPassword,
    loginWithGoogle,
};

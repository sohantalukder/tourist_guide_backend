import asyncHandler from "express-async-handler";
import User from "../../Models/User/userModel.js";
import { response } from "../../utlis/generateResponse.js";
import generateToken from "../../utlis/generateToken.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import UserOptVerification from "../../Models/User/otpVerificationModel.js";
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.comparePassword(password))) {
        res.status(200).json(
            response({
                code: 200,
                message: "ok",
                records: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    imageURL: user.image,
                    role: user.role,
                    userStatus: user.status,
                    token: generateToken(user._id),
                },
            })
        );
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
        res.status(400).json(
            response({ code: 400, message: "User already is already taken" })
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
        res.status(400).json(
            response({ code: 400, message: "Empty input fields!" })
        );
    } else if (!/^[a-zA-z ]*$/.test(name)) {
        res.status(400).json(
            response({ code: 400, message: "Invalid name entered!" })
        );
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(400).json(
            response({ code: 400, message: "Invalid email entered!" })
        );
    } else if (password.length < 8) {
        res.status(400).json(
            response({ code: 400, message: "Password is too short!" })
        );
    } else {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json(response(400, "User already exits", []));
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            res.status(201).json(
                response({
                    code: 201,
                    message: "Ok",
                    records: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        imageURL: user.image,
                        role: user.role,
                        userStatus: user.status,
                        token: generateToken(user._id),
                    },
                })
            );
        } else {
            res.status(400).json(400, "Invalid user data", []);
        }
    }
});

//send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "One-time verification code",
            html: (
                <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
                    <div style='margin:50px auto;width:70%;padding:20px 0'>
                        <div style='border-bottom:1px solid #eee'>
                            <a
                                href=''
                                style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'
                            >
                                Tourist Guide
                            </a>
                        </div>
                        <p style='font-size:1.1em'>Hi,</p>
                        <p>
                            Thank you for choosing Tourist Guide. Use the
                            following OTP to complete your Sign Up procedures.
                            OTP is valid for 5 minutes
                        </p>
                        <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>
                            324457
                        </h2>
                        <p style='font-size:0.9em;'>
                            Regards,
                            <br />
                            Tourist Guide
                        </p>
                        <hr style='border:none;border-top:1px solid #eee' />
                        <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                            <p>Tourist Guide</p>
                            <p>Mirpur, Dhaka</p>
                            <p>Bangladesh</p>
                        </div>
                    </div>
                </div>
            ),
        };
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOptVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + 300000,
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.status(202).json(
            response({
                code: 202,
                message: "Ok",
                records: {
                    id: id,
                    email: email,
                },
            })
        );
    } catch (error) {}
};

export { authUser, duplicateEmailCheck, registerUser };

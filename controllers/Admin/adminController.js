import User from "../../Models/User/userModel.js";
import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
import generateToken from "../../utlis/generateToken.js";
// Register a User
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.comparePassword(password))) {
        if (user.role === "admin") {
            res.status(200).json(
                response({
                    code: 200,
                    message: "Ok",
                    records: {
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
                    },
                })
            );
        } else {
            res.status(401).json(
                response({
                    code: 401,
                    message: "You do not have permission to make admin",
                })
            );
        }
    } else {
        res.status(401).json(
            response({
                code: 401,
                message: "Invalid email or password",
            })
        );
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const sort = { _id: -1 };
    const users = await User.find({}).sort(sort);
    if (users?.length > 0) {
        res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    users,
                },
            })
        );
    } else {
        res.status(404).json(response(404, "Users not found!", []));
    }
});

export { getAllUsers, adminLogin };

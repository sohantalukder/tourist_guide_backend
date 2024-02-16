import User from "../../Models/User/userModel.js";
import asyncHandler from "express-async-handler";
import { response } from "../../utility/generateResponse.js";
import generateToken from "../../utility/generateToken.js";
// Register a User
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.comparePassword(password))) {
        if (user.role === "admin") {
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Ok",
                    records: {
                        records: {
                            _id: user._id,
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
            return res.status(401).json(
                response({
                    code: 401,
                    message: "You do not have permission to make admin",
                })
            );
        }
    } else {
        return res.status(401).json(
            response({
                code: 401,
                message: "Invalid email or password",
            })
        );
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    const sortbyID = { _id: -1 };
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i",
              },
          }
        : {};
    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
        .sort(sortbyID)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    if (users?.length > 0) {
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    data: users,
                    PageNumber: page,
                    Pages: Math.ceil(count / pageSize),
                },
            })
        );
    } else {
        return res.status(404).json(response(404, "Users not found!", []));
    }
});
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        return res
            .status(200)
            .json(
                response({ code: 200, message: "User Removed Successfully" })
            );
    } else {
        return res
            .status(404)
            .json(response({ code: 404, message: "User not found!" }));
    }
});
export { getAllUsers, adminLogin, deleteUser };

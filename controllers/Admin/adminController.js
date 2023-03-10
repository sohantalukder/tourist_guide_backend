import User from "../../Models/User/userModel.js";
import asyncHandler from "express-async-handler";
import { response } from "../../utlis/generateResponse.js";
// Register a User
const adminLogin = async (req, res, next) => {
    const user = req.body;
    const requester = req.decodedEmail;
    if (requester) {
        const requesterAccount = await User.findOne({
            email: requester,
        });
        if (requesterAccount.role === "admin") {
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await User.updateOne(filter, updateDoc);
            res.json(result);
        }
    } else {
        res.status(401).json({
            message: "You do not have permission to make admin",
        });
    }
};

const admin = async (req, res, next) => {
    const email = req.params.email;
    const query = { email: email };
    const role = await User.findOne(query);
    let isAdmin = false;
    if (role?.role === "admin") {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
};
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

export { getAllUsers };

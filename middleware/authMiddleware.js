import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/User/userModel.js";
import { response } from "../utlis/generateResponse.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select("-password");
                next();
            }
        } catch (error) {
            console.error(error);
            res.status(401).json(
                response({ code: 401, message: "Not authorized, token failed" })
            );
        }
    }
    if (!token) {
        res.status(401).json(
            response({ code: 401, message: "Not authorized, No token" })
        );
    }
});
const admin = (req, res, next) => {
    if (req?.user && req.user?.role === "admin") {
        next();
    } else {
        res.status(401).json(
            response({ code: 401, message: "Not authorized as an admin" })
        );
    }
};
const verifiedEmail = (req, res, next) => {
    if (req?.user && req.user?.emailVerify === true) {
        next();
    } else {
        res.status(401).json(
            response({
                code: 401,
                message:
                    "Your email is not verified. Please verify your email first.",
            })
        );
    }
};
export { protect, admin, verifiedEmail };

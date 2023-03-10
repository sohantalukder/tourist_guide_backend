import express from "express";
import { adminLogin, admin } from "../controllers/Admin/adminController.js";
import { users, userUpdate } from "../controllers/User/User.js";
import {
    authUser,
    registerUser,
    verifyOTP,
} from "../controllers/User/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/adminLogin").put(adminLogin);
router.route("/admin").get(admin);
router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/emailVerification").post(protect, verifyOTP);
router.route("/users").put(userUpdate);
export default router;

import express from "express";
import { adminLogin, admin } from "../../controllers/Admin/adminController.js";
import { userUpdate } from "../../controllers/User/User.js";
import {
    authUser,
    getUser,
    registerUser,
    resendVerifyOTP,
    updateUserProfile,
    verifyOTP,
} from "../../controllers/User/userController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/adminLogin").put(adminLogin);
router.route("/admin").get(admin);
router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/emailVerification").post(protect, verifyOTP);
router.route("/user/:id").get(protect, getUser);
router.route("/profile/update").put(protect, updateUserProfile);
router.route("/resendVerifyOTP").get(protect, resendVerifyOTP);
router.route("/users").put(userUpdate);
export default router;

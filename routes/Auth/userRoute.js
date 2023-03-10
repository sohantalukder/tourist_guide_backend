import express from "express";
import {
    authUser,
    getUser,
    registerUser,
    resendVerifyOTP,
    updateUserProfile,
    uploadProfileImage,
    verifyOTP,
} from "../../controllers/User/userController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { singleUpload } from "../../middleware/multer.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/emailVerification").post(protect, verifyOTP);
router.route("/user/:id").get(protect, verifiedEmail, getUser);
router.route("/profile/update").put(protect, verifiedEmail, updateUserProfile);
router
    .route("/profile/updateProfilePicture")
    .put(protect, singleUpload, uploadProfileImage);
router.route("/resendVerifyOTP").get(protect, resendVerifyOTP);

export default router;

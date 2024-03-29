import express from "express";
import {
    authUser,
    changePassword,
    getUser,
    loginWithGoogle,
    registerUser,
    resendVerifyOTP,
    resetPassword,
    storeResetPassword,
    updateUserProfile,
    uploadProfileImage,
    verifyOTP,
    verifyResetPassword,
} from "../../controllers/User/userController.js";
import {
    protect,
    protectResetPassword,
    verifiedEmail,
} from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/emailVerification").post(protect, verifyOTP);
router.route("/user/:id").get(protect, verifiedEmail, getUser);
router.route("/profile/update").put(protect, verifiedEmail, updateUserProfile);
router
    .route("/profile/updateProfilePicture")
    .put(protect, verifiedEmail, upload, uploadProfileImage);
router.route("/resendVerifyOTP").get(protect, resendVerifyOTP);
router.route("/changePassword").put(protect, verifiedEmail, changePassword);
router.route("/resetPassword").post(resetPassword);
router.route("/googleLogin").post(loginWithGoogle);
router.route("/resetPassword/verify").post(verifyResetPassword);
router
    .route("/resetPassword/store")
    .put(protectResetPassword, storeResetPassword);

export default router;

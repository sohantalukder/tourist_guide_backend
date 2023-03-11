import express from "express";
import { updatePreference } from "../../controllers/Preference/PreferenceController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();
router
    .route("/update")
    .put(protect, admin, upload.single("logo"), updatePreference);

export default router;

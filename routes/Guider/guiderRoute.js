import express from "express";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
import {
    addGuider,
    deleteGuider,
    getGuiderDetails,
    updateGuiderInfo,
} from "../../controllers/Guider/guiderController.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, addGuider);
router.route("/delete/:id").delete(protect, verifiedEmail, deleteGuider);
router
    .route("/update/:id")
    .put(protect, verifiedEmail, upload, updateGuiderInfo);
router.route("/:id").get(protect, verifiedEmail, getGuiderDetails);

export default router;

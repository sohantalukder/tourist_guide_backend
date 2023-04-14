import express from "express";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
import {
    addGuider,
    deleteGuider,
} from "../../controllers/Guider/guiderController.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, addGuider);
router.route("/delete/:id").post(protect, verifiedEmail, deleteGuider);

export default router;

import express from "express";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
import { addGuider } from "../../controllers/Guider/guiderController.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, addGuider);

export default router;

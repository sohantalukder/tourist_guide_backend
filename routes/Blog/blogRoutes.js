import express from "express";
import { createBlog } from "../../controllers/Blog/BlogController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, createBlog);

export default router;

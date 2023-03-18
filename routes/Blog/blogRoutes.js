import express from "express";
import {
    allBlogsList,
    createBlog,
    updateBlog,
    userBlogsList,
} from "../../controllers/Blog/blogController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, createBlog);
router.route("/update/:id").put(protect, verifiedEmail, upload, updateBlog);
router.route("/myBlogs").get(protect, verifiedEmail, userBlogsList);
router.route("/allBlogs").get(protect, verifiedEmail, allBlogsList);

export default router;

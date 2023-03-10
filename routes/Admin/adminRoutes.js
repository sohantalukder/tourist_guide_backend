import express from "express";
import {
    adminLogin,
    getAllUsers,
} from "../../controllers/Admin/adminController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/allUsers").get(protect, admin, getAllUsers);
router.route("/").post(adminLogin);
export default router;

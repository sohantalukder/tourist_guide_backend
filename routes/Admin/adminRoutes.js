import express from "express";
import { getAllUsers } from "../../controllers/Admin/adminController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/allUsers").get(protect, admin, getAllUsers);
export default router;

import express from "express";
import {
    adminLogin,
    deleteUser,
    getAllUsers,
} from "../../controllers/Admin/adminController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(adminLogin);
router.route("/allUsers").get(protect, admin, getAllUsers);
router.route("/:id").delete(protect, admin, deleteUser);
export default router;

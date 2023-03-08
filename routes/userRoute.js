import express from "express";
import { adminLogin, admin } from "../controllers/Admin/adminController.js";
import { users, userUpdate } from "../controllers/User/User.js";

const router = express.Router();

router.route("/adminLogin").put(adminLogin);
router.route("/admin").get(admin);
router.route("/users").post(users);
router.route("/users").put(userUpdate);
export default router;

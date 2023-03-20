import express from "express";
import { addDivision } from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/division/store").post(protect, admin, addDivision);

export default router;

import express from "express";
import {
    addDivision,
    editDivision,
} from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/division/store").post(protect, admin, addDivision);
router.route("/division/:code/update").put(protect, admin, editDivision);

export default router;

import express from "express";
import {
    addDivision,
    deleteDivision,
    editDivision,
} from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/division/store").post(protect, admin, addDivision);
router.route("/division/:code/update").put(protect, admin, editDivision);
router.route("/division/:code/delete").delete(protect, admin, deleteDivision);

export default router;

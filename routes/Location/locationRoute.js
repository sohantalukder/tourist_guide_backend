import express from "express";
import {
    addDistrict,
    addDivision,
    allDistricts,
    allDivisions,
    deleteDivision,
    editDivision,
    updateDistrict,
} from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/division/store").post(protect, admin, addDivision);
router.route("/divisions").get(allDivisions);
router.route("/district/:code/all").get(allDistricts);
router.route("/district/store").post(protect, admin, addDistrict);
router.route("/division/:code/update").put(protect, admin, editDivision);
router.route("/district/:code/update").put(protect, admin, updateDistrict);
router.route("/division/:code/delete").delete(protect, admin, deleteDivision);

export default router;

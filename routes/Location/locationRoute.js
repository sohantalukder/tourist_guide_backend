import express from "express";
import {
    addDistrict,
    addDivision,
    allDistricts,
    allDivisions,
    deleteDistrict,
    deleteDivision,
    editDivision,
    updateDistrict,
} from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/division/store").post(protect, admin, addDivision);
router.route("/divisions").get(allDivisions);
router.route("/division/:code/districts").get(allDistricts);
router.route("/district/store").post(protect, admin, addDistrict);
router.route("/division/:code/update").put(protect, admin, editDivision);
router
    .route("/division/:code/district/:districtCode/update")
    .put(protect, admin, updateDistrict);
router.route("/division/:code/delete").delete(protect, admin, deleteDivision);
router
    .route("/division/:code/district/:districtCode")
    .delete(protect, admin, deleteDistrict);

export default router;

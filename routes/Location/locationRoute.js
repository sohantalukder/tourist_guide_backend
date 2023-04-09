import express from "express";
import {
    addDistrict,
    addDivision,
    addSubDistrict,
    allDistricts,
    allDivisions,
    allSubDistrict,
    deleteDistrict,
    deleteDivision,
    deleteSubDistrict,
    editDivision,
    updateDistrict,
    updateSubDistrict,
} from "../../controllers/Location/locationController.js";
import { admin, protect } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.route("/divisions").get(allDivisions);
router.route("/division/:code/districts").get(allDistricts);
router
    .route("/division/:code/districts/:districtCode/upazilas")
    .get(allSubDistrict);
router.route("/division/store").post(protect, admin, addDivision);
router.route("/upazilas/store").post(protect, admin, addSubDistrict);
router.route("/district/store").post(protect, admin, addDistrict);
router.route("/division/:code/update").put(protect, admin, editDivision);
router
    .route("/division/:code/district/:districtCode/update")
    .put(protect, admin, updateDistrict);
router
    .route(
        "/division/:code/district/:districtCode/upazilas/:upazilaCode/update"
    )
    .put(protect, admin, updateSubDistrict);
router.route("/division/:code/delete").delete(protect, admin, deleteDivision);
router
    .route("/division/:code/district/:districtCode")
    .delete(protect, admin, deleteDistrict);
router
    .route("/division/:code/district/:districtCode/upazila/:upazilaCode")
    .delete(protect, admin, deleteSubDistrict);

export default router;

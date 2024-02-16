import express from "express";
import { admin, protect } from "../../middleware/authMiddleware.js";
import LocationValidator from "@validators/locationValidation.js";
import { Router } from "express";
import LocationController from "@controllers/location/locationController.js";
const router = Router();

const locationValidator = new LocationValidator();
const locationController = new LocationController();

// router.get(
//     "/divisions",
//     locationValidator.divisionCreateValidator,
//     allDivisions
// );
// router.route("/division/:code/districts").get(allDistricts);
// router
//     .route("/division/:code/districts/:districtCode/upazilas")
//     .get(allSubDistrict);
router.post(
    "/add-division",
    locationValidator.divisionCreateValidator,
    locationController.add
);
// router.route("/upazilas/store").post(protect, admin, addSubDistrict);
// router.route("/district/store").post(protect, admin, addDistrict);
// router.route("/division/:code/update").put(protect, admin, editDivision);
// router
//     .route("/division/:code/district/:districtCode/update")
//     .put(protect, admin, updateDistrict);
// router
//     .route(
//         "/division/:code/district/:districtCode/upazilas/:upazilaCode/update"
//     )
//     .put(protect, admin, updateSubDistrict);
// router.route("/division/:code/delete").delete(protect, admin, deleteDivision);
// router
//     .route("/division/:code/district/:districtCode")
//     .delete(protect, admin, deleteDistrict);
// router
//     .route("/division/:code/district/:districtCode/upazila/:upazilaCode")
//     .delete(protect, admin, deleteSubDistrict);

export default router;

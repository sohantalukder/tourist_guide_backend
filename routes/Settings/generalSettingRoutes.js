import express from "express";
import {
    updateSetting,
    generalSetting,
} from "../../controllers/Settings/generalSettingController.js";
const router = express.Router();
router.route("/setting/updateSetting/:id").put(updateSetting);
router.route("/setting/generalSetting").get(generalSetting);

export default router;

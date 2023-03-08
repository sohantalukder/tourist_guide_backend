const express = require('express');
const {
	updateSetting,
	generalSetting,
} = require('../../controllers/Settings/generalSettingController');
const router = express.Router();
router.route('/setting/updateSetting/:id').put(updateSetting);
router.route('/setting/generalSetting').get(generalSetting);

module.exports = router;

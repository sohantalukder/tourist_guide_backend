const express = require('express');
const { adminLogin, admin } = require('../controllers/Admin/adminController');
const { verifyToken } = require('../controllers/Admin/adminController');
const { users, userUpdate } = require('../controllers/User/User');

const router = express.Router();

router.route('/adminLogin', verifyToken).put(adminLogin);
router.route('/admin').get(admin);
router.route('/users').post(users);
router.route('/users').put(userUpdate);
module.exports = router;

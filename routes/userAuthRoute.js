const express = require('express');
const router = express.Router();
const {
  createUser,
  verifyUser,
  loginUser,
  getUser,
  updateUser,
  updatePassword,
  logoutUser,
} = require('../controllers/userAuthController');
const { verifyUserToken } = require('../middleware/verifyToken');

router.route('/auth/register').post(createUser);
router.route('/auth/verify/:token').get(verifyUser);
router.route('/auth/login').post(loginUser);
router.route('/').get(verifyUserToken, getUser);
router.route('/auth/logout').get(logoutUser);
router.route('/auth/edit').patch(verifyUserToken, updateUser);
router.route('/auth/edit/password').patch(verifyUserToken, updatePassword);

module.exports = router;

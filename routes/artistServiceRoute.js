const express = require('express');
const router = express.Router();
const { getAlbumInfo } = require('../controllers/artistServiceController');
const { verifyAdminToken } = require('../middleware/verifyToken');

router.get('/album-info', verifyAdminToken, getAlbumInfo);

module.exports = router;

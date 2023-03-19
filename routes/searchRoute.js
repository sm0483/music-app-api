const express = require('express');
const router = express.Router();
const { getResult } = require('../controllers/searchController');

const { verifyUserToken } = require('../middleware/verifyToken');

router.get('/:query', verifyUserToken, getResult);

module.exports = router;

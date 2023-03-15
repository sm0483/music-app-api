const express = require("express");
const router = express.Router();
const {
    getAlbumInfo
} = require("../controllers/artistServiceController");
const { verifyAdminToken } = require("../middleware/verifyToken");
const setCache=require('../middleware/cache');


router.get("/album-info", verifyAdminToken, setCache, getAlbumInfo);



module.exports = router;

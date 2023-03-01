const express=require('express');
const router=express.Router();
const {
    uploadSong,
    uploadSongImage,
    deleteSong
}=require("../controllers/musicController");
const upload=require("../utils/multer");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/').post(verifyAdminToken,upload.single('songFile'),uploadSong);
router.route('/:songId').delete(verifyAdminToken,deleteSong).patch(verifyAdminToken,upload.single("songImage"),uploadSongImage);


module.exports=router;
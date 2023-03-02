const express=require('express');
const router=express.Router();
const {
    uploadSong,
    uploadSongImage,
    deleteSong,
    getAllSong,
    getSongById
}=require("../controllers/musicController");

const upload=require("../utils/multer");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.post('/',verifyAdminToken,upload.single('songFile'),uploadSong);
router.get('/:songId',verifyAdminToken,getSongById);
router.get('/',verifyAdminToken,getAllSong);
router.delete('/:songId',verifyAdminToken,deleteSong);
router.patch('/:songId',verifyAdminToken,upload.single('songImage'),uploadSongImage);


module.exports=router;
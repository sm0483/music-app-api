const express=require('express');
const router=express.Router();
const {
    createSong
}=require("../controllers/musicController");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/').post(verifyAdminToken,createSong);
// router.route('/:albumId').delete(verifyAdminToken,deleteAlbum).get(getAlbumById);


module.exports=router;
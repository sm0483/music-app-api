const express=require('express');
const router=express.Router();
const {
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums
}=require("../controllers/albumController");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/').post(verifyAdminToken,createAlbum).get(getAllAlbums);
router.route('/:albumId').delete(verifyAdminToken,deleteAlbum).get(getAlbumById);


module.exports=router;
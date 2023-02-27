const express=require('express');
const router=express.Router();
const {
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums
}=require("../controllers/albumController");

const {verifyAdminToken}=require("../middleware/verifyToken");
const upload=require("../utils/multer");


router.route('/').post(verifyAdminToken,upload.single('albumImage'),createAlbum).get(getAllAlbums);
router.route('/:albumId').delete(verifyAdminToken,deleteAlbum).get(getAlbumById);


module.exports=router;
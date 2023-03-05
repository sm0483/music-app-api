const express=require('express');
const router=express.Router();
const {
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums,
    updateAlbum
}=require("../controllers/albumController");

const {verifyAdminToken}=require("../middleware/verifyToken");
const upload=require("../utils/multer");


router.post('/',verifyAdminToken,upload.single('albumImage'),createAlbum);
router.get('/',getAllAlbums);
router.get('/:albumId',getAlbumById);
router.delete('/:albumId',verifyAdminToken,deleteAlbum);
router.patch('/:albumId',verifyAdminToken,upload.single('albumImage'),updateAlbum);


module.exports=router;
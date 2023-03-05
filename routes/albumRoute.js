const express=require('express');
const router=express.Router();
const {
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums,
    updateAlbum,
    removeFromAlbum
}=require("../controllers/albumController");

const {verifyAdminToken}=require("../middleware/verifyToken");
const upload=require("../utils/multer");


router.post('/',verifyAdminToken,upload.single('albumImage'),createAlbum);
router.get('/',verifyAdminToken,getAllAlbums);
router.get('/:albumId',verifyAdminToken,getAlbumById);
router.delete('/:albumId',verifyAdminToken,deleteAlbum);
router.patch('/:albumId',verifyAdminToken,upload.single('albumImage'),updateAlbum);
router.patch('/remove/:albumId',verifyAdminToken,removeFromAlbum);

module.exports=router;
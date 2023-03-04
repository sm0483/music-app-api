const express=require('express');
const router=express.Router();
const { 
    createArtist,verifyArtist,
    getArtist,loginArtist,updateAdmin,
    updatePassword,logoutArtist,updateArtist
}=require('../controllers/adminAuthController');
const {verifyAdminToken}=require("../middleware/verifyToken");
const upload=require("../utils/multer");




router.post('/auth/register',createArtist);
router.get('/auth/verify/:token',verifyArtist);
router.post('/auth/login',loginArtist);
router.get('/',verifyAdminToken,getArtist);
router.get('/auth/logout',logoutArtist);
router.patch('/auth/edit',verifyAdminToken,upload.single('profileImage'),updateArtist);
router.patch('/auth/edit/password',verifyAdminToken,updatePassword);
// router.patch(,verifyAdminToken,updateAdmin);



module.exports=router;
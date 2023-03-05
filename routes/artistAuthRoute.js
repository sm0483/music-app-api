const express=require('express');
const router=express.Router();
const { 
    createArtist,verifyArtist,
    getArtist,loginArtist,
    updatePassword,logoutArtist,updateArtist
}=require('../controllers/artistAuthController');
const {verifyAdminToken}=require("../middleware/verifyToken");
const upload=require("../utils/multer");




router.post('/auth/register',createArtist);
router.get('/auth/verify/:token',verifyArtist);
router.post('/auth/login',loginArtist);
router.get('/',verifyAdminToken,getArtist);
router.get('/auth/logout',logoutArtist);
router.patch('/auth/edit',verifyAdminToken,upload.single('profilePic'),updateArtist);
router.patch('/auth/edit/password',verifyAdminToken,updatePassword);



module.exports=router;
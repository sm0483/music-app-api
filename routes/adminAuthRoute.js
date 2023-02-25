const express=require('express');
const router=express.Router();
const { 
    createAdmin,verifyAdmin,
    getAdmin,loginAdmin,updateAdmin,
    updatePassword,logoutAdmin
}=require('../controllers/adminAuthController');
const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/auth/register').post(createAdmin);
router.route('/auth/verify/:token').get(verifyAdmin);
router.route('/auth/login').post(loginAdmin);
router.route('/').get(verifyAdminToken,getAdmin);
router.route('/auth/logout').get(logoutAdmin);
router.route('/auth/edit').patch(verifyAdminToken,updateAdmin);
router.route('/auth/edit/password').patch(verifyAdminToken,updatePassword);



module.exports=router;
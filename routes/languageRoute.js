const express=require('express');
const router=express.Router();

const {
    createLanguage, 
    updateLanguage,
    deleteLanguage,
    getLanguage,
    getAllLanguage
}=require("../controllers/languageController");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/').post(verifyAdminToken,createLanguage).get(getAllLanguage);
router.route('/:languageId').patch(verifyAdminToken,updateLanguage).delete(verifyAdminToken,deleteLanguage).get(getLanguage);


module.exports=router;
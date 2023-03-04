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


router.post('/',verifyAdminToken,createLanguage);
router.get('/',getAllLanguage);
router.patch('/:languageId',verifyAdminToken,updateLanguage);
router.delete('/:languageId',verifyAdminToken,deleteLanguage);
router.get('/:languageId',getLanguage);


module.exports=router;
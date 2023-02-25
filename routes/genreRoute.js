const express=require('express');
const router=express.Router();
const {
    createGenre,updateGenre,
    getAllGenres,getGenre,deleteGenre
}=require("../controllers/genreController");

const {verifyAdminToken}=require("../middleware/verifyToken");


router.route('/').post(verifyAdminToken,createGenre).get(getAllGenres);
router.route('/:genreId').patch(verifyAdminToken,updateGenre).delete(verifyAdminToken,deleteGenre).get(getGenre);


module.exports=router;
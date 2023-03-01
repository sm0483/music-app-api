const express=require('express');
const router=express.Router();
const {
    createPlaylist,
    updatePlayList,
    deletePlayList
}=require("../controllers/playListController");

const {verifyUserToken}=require("../middleware/verifyToken");



router.route('/').post(verifyUserToken,createPlaylist);
router.route('/:playListId').patch(verifyUserToken,updatePlayList).delete(verifyUserToken,deletePlayList);

module.exports=router;
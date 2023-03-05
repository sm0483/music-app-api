const express=require('express');
const router=express.Router();
const {
    createPlaylist,
    updatePlayList,
    deletePlayList,
    getPlayLists,
    getPlayList,
    removeFromPlayList
}=require("../controllers/playListController");

const {verifyUserToken}=require("../middleware/verifyToken");



router.get('/',verifyUserToken,getPlayLists);
router.get('/:playListId',verifyUserToken,getPlayList);
router.post('/',verifyUserToken,createPlaylist);
router.patch('/:playListId',verifyUserToken,updatePlayList);
router.delete('/:playListId',verifyUserToken,deletePlayList);
router.patch('/remove/:playListId',verifyUserToken,removeFromPlayList);


module.exports=router;
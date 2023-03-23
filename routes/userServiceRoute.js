const express = require("express");
const router = express.Router();
const {
   getSong,
   handleLikeSong,
   removeLikeSong,
   handleLikeAlbum,
   removeLikeAlbum,
   getAlbums,
   getAlbum,
   getLikedSongs,
} = require("../controllers/userServiceController");
const { verifyUserToken } = require("../middleware/verifyToken");

router.get("/songs", verifyUserToken, getSong);
router.post("/songs/like/:songId", verifyUserToken, handleLikeSong);
router.post("/songs/remove-like/:songId", verifyUserToken, removeLikeSong);
router.post("/albums/like/:albumId", verifyUserToken, handleLikeAlbum);
router.post("/albums/remove-like/:albumId", verifyUserToken, removeLikeAlbum);
router.get("/albums", verifyUserToken, getAlbums);
router.get("/albums/:albumId", verifyUserToken, getAlbum);
router.get("/liked", verifyUserToken, getLikedSongs);

module.exports = router;

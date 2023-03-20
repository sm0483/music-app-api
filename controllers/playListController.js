const asyncWrapper = require("../error/asyncWrapper");
const Playlist = require("../models/playlist");
const {
   playListValidation,
   playListUpdateValidate,
   playListRemoveValidate,
} = require("../utils/joiValidate");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const Like = require("../models/like");
const { getPlayListPipeline } = require("../pipelines/playlist");
const { songsWithArtistNames } = require("../utils/artistUtils");

//create playList
const createPlaylist = asyncWrapper(async (req, res) => {
   const { error } = playListValidation(req.body);
   req.body.userId = req.user.id;
   if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   let playList = await Playlist.create(req.body);
   playList = playList.toObject();
   res.status(StatusCodes.CREATED).json(playList);
});

//update playlist

const updatePlayList = asyncWrapper(async (req, res) => {
   const playListId = req.params.playListId;
   if (!playListId)
      throw new CustomError("Invalid playList id", StatusCodes.BAD_REQUEST);
   const { error } = playListUpdateValidate(req.body);
   if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   const updateSongId = {
      $push: {
         songsId: { $each: req.body.songsId },
      },
   };
   if (req.body.name) updateSongId.name = req.body.name;
   const playList = await Playlist.findOneAndUpdate(
      { _id: playListId },
      updateSongId,
      { runValidators: true, new: true }
   );
   if (!playList)
      throw new CustomError("playlist not present", StatusCodes.BAD_REQUEST);
   res.status(StatusCodes.OK).json(playList);
});

//delete playlist

const deletePlayList = asyncWrapper(async (req, res) => {
   const playListId = req.params.playListId;
   if (!playListId)
      throw new CustomError("Invalid playList id", StatusCodes.BAD_REQUEST);
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Invalid request", StatusCodes.BAD_REQUEST);
   const playlist = await Playlist.findOneAndDelete({
      _id: playListId,
      userId: userId,
   });
   if (!playlist)
      throw new CustomError("playlist not present", StatusCodes.BAD_REQUEST);
   res.status(StatusCodes.OK).json(playlist);
});

//get playlists

const getPlayLists = asyncWrapper(async (req, res) => {
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Invalid request", StatusCodes.BAD_REQUEST);
   const playLists = await Playlist.find({ userId }, { songsId: 0 });
   if (!playLists)
      throw new CustomError("playlist not present", StatusCodes.BAD_REQUEST);
   res.status(StatusCodes.OK).json(playLists);
});

// get playlist

const getPlayList = asyncWrapper(async (req, res) => {
   const playListId = req.params.playListId;
   if (!playListId)
      throw new CustomError("Invalid playList id", StatusCodes.BAD_REQUEST);
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Invalid request", StatusCodes.BAD_REQUEST);
   let likedSong = await Like.findOne({ userId });
   if (!likedSong) likedSong = { songIds: [] };
   const playListPipeline = getPlayListPipeline(likedSong, playListId);
   let playList = await Playlist.aggregate(playListPipeline);
   playList = await songsWithArtistNames(playList);
   if (!playList)
      throw new CustomError("playlist not present", StatusCodes.BAD_REQUEST);
   res.status(StatusCodes.OK).json(playList);
});

const removeFromPlayList = asyncWrapper(async (req, res) => {
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Invalid request", StatusCodes.BAD_REQUEST);
   const playListId = req.params.playListId;
   if (!playListId)
      throw new CustomError("Invalid playList id", StatusCodes.BAD_REQUEST);
   const { error } = playListRemoveValidate(req.body);
   if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   const updateSongId = {
      $pull: {
         songsId: { $in: req.body.songsId },
      },
   };
   const playList = await Playlist.findOneAndUpdate(
      { _id: playListId, userId },
      updateSongId,
      { runValidators: true, new: true }
   );
   if (!playList)
      throw new CustomError("playlist not present", StatusCodes.BAD_REQUEST);
   res.status(StatusCodes.OK).json(playList);
});

module.exports = {
   createPlaylist,
   updatePlayList,
   deletePlayList,
   getPlayLists,
   getPlayList,
   removeFromPlayList,
};

const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../error/asyncWrapper");
const CustomError = require("../error/custom");
const { queryValidate } = require("../utils/joiValidate");
const Song = require("../models/music");
const Like = require("../models/like");
const Album = require("../models/album");
const { default: mongoose } = require("mongoose");
const { getSongPipeline, getAlbumPipeline } = require("../pipelines/song");
const { getAlbumPipelineAlbum } = require("../pipelines/album");

// get song by query
const getSong = asyncWrapper(async (req, res) => {
   const { error } = queryValidate(req.query);
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Token not valid", StatusCodes.UNAUTHORIZED);
   if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   const size = parseInt(req.query.count);
   let likedSong = await Like.findOne({ userId });
   if (likedSong == null) likedSong = { songIds: [], albumIds: [] };
   const songPipeline = getSongPipeline(size, likedSong);
   let songs = await Song.aggregate(songPipeline);
   if (songs === null)
      throw new CustomError("No songs found", StatusCodes.NOT_FOUND);
   res.status(StatusCodes.OK).json(songs);
});

// like song
const handleLikeSong = asyncWrapper(async (req, res) => {
   const songId = req.params.songId;
   const userId = req.user.id;
   if (!songId)
      throw new CustomError("Song id is required", StatusCodes.BAD_REQUEST);
   if (!userId)
      throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
   const song = await Song.findById(songId);
   if (!song) throw new CustomError("Song not found", StatusCodes.NOT_FOUND);
   let likedSong = await Like.findOne({ userId });
   let likedSongArray = null;
   likedSong ? (likedSongArray = likedSong.songIds) : (likedSongArray = null);
   if (likedSongArray && likedSongArray.includes(songId))
      throw new CustomError("Song already liked", StatusCodes.BAD_REQUEST);
   if (!likedSong) {
      const newLikedSong = await Like.create({ userId, songIds: [songId] });
   } else {
      likedSong.songIds.push(songId);
      await likedSong.save();
   }
   const songUpdateResponse = await Song.findOneAndUpdate(
      { _id: songId },
      { $inc: { totalLikes: 1 } },
      { runValidators: true, new: true }
   );
   res.status(StatusCodes.OK).json(songUpdateResponse);
});

// remove like
const removeLikeSong = asyncWrapper(async (req, res) => {
   const songId = req.params.songId;
   const userId = req.user.id;
   if (!songId)
      throw new CustomError("Song id is required", StatusCodes.BAD_REQUEST);
   if (!userId)
      throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
   const song = await Song.findById(songId);
   if (!song) throw new CustomError("Song not found", StatusCodes.NOT_FOUND);
   let likedSong = await Like.findOne({ userId });
   let likedSongArray = null;
   likedSong ? (likedSongArray = likedSong.songIds) : (likedSongArray = null);
   if (!likedSongArray || !likedSongArray.includes(songId))
      throw new CustomError("Song is not  liked", StatusCodes.BAD_REQUEST);
   likedSong.songIds.pop(songId);
   await likedSong.save();
   const songUpdateResponse = await Song.findOneAndUpdate(
      { _id: songId },
      { $inc: { totalLikes: -1 } },
      { runValidators: true, new: true }
   );
   res.status(StatusCodes.OK).json(songUpdateResponse);
});

//  like  album

const handleLikeAlbum = asyncWrapper(async (req, res) => {
   const albumId = req.params.albumId;
   const userId = req.user.id;
   if (!albumId)
      throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
   if (!userId)
      throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
   const album = await Album.findById(albumId);
   if (!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
   let likedAlbum = await Like.findOne({ userId });
   let likedAlbumArray = null;
   likedAlbum
      ? (likedAlbumArray = likedAlbum.albumIds)
      : (likedAlbumArray = null);
   if (likedAlbumArray && likedAlbumArray.includes(albumId))
      throw new CustomError("Album already liked", StatusCodes.BAD_REQUEST);
   if (!likedAlbum) {
      const newLikedAlbum = await Like.create({ userId, albumIds: [albumId] });
   } else {
      likedAlbum.albumIds.push(albumId);
      await likedAlbum.save();
   }
   const albumUpdateResponse = await Album.findOneAndUpdate(
      { _id: albumId },
      { $inc: { totalLikes: 1 } },
      { runValidators: true, new: true }
   );
   res.status(StatusCodes.OK).json(albumUpdateResponse);
});

// remove like from album

const removeLikeAlbum = asyncWrapper(async (req, res) => {
   const albumId = req.params.albumId;
   const userId = req.user.id;
   if (!albumId)
      throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
   if (!userId)
      throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
   const album = await Album.findById(albumId);
   if (!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
   let likedAlbum = await Like.findOne({ userId });
   let likedAlbumArray = null;
   likedAlbum
      ? (likedAlbumArray = likedAlbum.albumIds)
      : (likedAlbumArray = null);
   if (!likedAlbumArray || !likedAlbumArray.includes(albumId))
      throw new CustomError("Album is not  liked", StatusCodes.BAD_REQUEST);
   likedAlbum.albumIds.pop(albumId);
   await likedAlbum.save();
   const albumUpdateResponse = await Album.findOneAndUpdate(
      { _id: albumId },
      { $inc: { totalLikes: -1 } },
      { runValidators: true, new: true }
   );
   res.status(StatusCodes.OK).json(albumUpdateResponse);
});

const getAlbum = asyncWrapper(async (req, res) => {
   const albumId = req.params.albumId;
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Token not valid", StatusCodes.UNAUTHORIZED);
   if (!albumId)
      throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
   const album = await Album.findById(albumId);
   if (!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
   let likedSong = await Like.findOne({ userId });
   if (!likedSong) likedSong = { songIds: [] };
   const albumPipeline = getAlbumPipeline(albumId, likedSong);
   const songs = await Song.aggregate(albumPipeline);
   res.status(StatusCodes.OK).json(songs);
});

const getAlbums = asyncWrapper(async (req, res) => {
   const userId = req.user.id;
   let count = req.query.count;
   if (!count)
      throw new CustomError("Count should be present", StatusCodes.BAD_REQUEST);
   count = parseInt(count);
   if (!userId)
      throw new CustomError("Token not valid", StatusCodes.UNAUTHORIZED);
   let likedAlbum = await Like.findOne({ userId });
   if (!likedAlbum) likedAlbum = { albumIds: [] };
   const albumPipeline = getAlbumPipelineAlbum(likedAlbum, count);
   const albums = await Album.aggregate(albumPipeline);
   if (!albums) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
   res.status(StatusCodes.OK).json(albums);
});

const getLikedSongs = asyncWrapper(async (req, res) => {
   const userId = req.user.id;
   if (!userId)
      throw new CustomError("Token not valid", StatusCodes.UNAUTHORIZED);
   const LikedSongs = await Like.findOne({ userId }).populate({
      path: "songIds",
      select: "songName songFile artistId",
      populate: {
         path: "artistId",
         select: "name",
      },
   });
   if (!LikedSongs)
      throw new CustomError("Songs not found", StatusCodes.NOT_FOUND);
   res.status(StatusCodes.OK).json(LikedSongs);
});

module.exports = {
   getSong,
   handleLikeSong,
   removeLikeSong,
   handleLikeAlbum,
   removeLikeAlbum,
   getAlbum,
   getAlbums,
   getLikedSongs,
};

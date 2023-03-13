const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../error/asyncWrapper");
const CustomError = require("../error/custom");
const { queryValidate } = require("../utils/joiValidate");
const Song = require("../models/music");
const Like = require("../models/like");
const Album=require("../models/album");

// get song by query
const getSong = asyncWrapper(async (req, res) => {
  const { error } = queryValidate(req.query);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const songs = await Song.find({}).limit(req.query.count).populate({
    path:"artistId",
    select:"name"
  });
  if (songs === null)
    throw new CustomError("No songs found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(songs);
});

// like song
const handleLikeSong = asyncWrapper(async (req, res) => {
  const songId = req.params.songId;
  const userId = req.user.id;
  if(!songId) throw new CustomError("Song id is required", StatusCodes.BAD_REQUEST);
  if(!userId) throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
  const song = await Song.findById(songId);
  if(!song) throw new CustomError("Song not found", StatusCodes.NOT_FOUND);
  let likedSong=await Like.findOne({userId});
  let likedSongArray=null;
  likedSong ? likedSongArray=likedSong.songIds : likedSongArray=null; 
  if(likedSongArray && likedSongArray.includes(songId)) throw new CustomError("Song already liked", StatusCodes.BAD_REQUEST);
  if(!likedSong){
    const newLikedSong=await Like.create({userId,songIds:[songId]});
  }
  else{
    likedSong.songIds.push(songId);
    await likedSong.save();
  }
  const songUpdateResponse=await Song.findOneAndUpdate({_id:songId},{$inc:{totalLikes:1}},{runValidators:true,new:true});
  res.status(StatusCodes.OK).json(songUpdateResponse);
});

// remove like
const removeLikeSong = asyncWrapper(async (req, res) => {
  const songId = req.params.songId;
  const userId = req.user.id;
  if(!songId) throw new CustomError("Song id is required", StatusCodes.BAD_REQUEST);
  if(!userId) throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
  const song = await Song.findById(songId);
  if(!song) throw new CustomError("Song not found", StatusCodes.NOT_FOUND);
  let likedSong=await Like.findOne({userId});
  let likedSongArray=null;
  likedSong ? likedSongArray=likedSong.songIds : likedSongArray=null; 
  if(!likedSongArray || !likedSongArray.includes(songId)) throw new CustomError("Song is not  liked", StatusCodes.BAD_REQUEST);
  likedSong.songIds.pop(songId);
  await likedSong.save();
  const songUpdateResponse=await Song.findOneAndUpdate({_id:songId},{$inc:{totalLikes:-1}},{runValidators:true,new:true});
  res.status(StatusCodes.OK).json(songUpdateResponse);
});


//  like  album

const handleLikeAlbum = asyncWrapper(async (req, res) => {
  const albumId = req.params.albumId;
  const userId = req.user.id;
  if(!albumId) throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
  if(!userId) throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
  const album = await Album.findById(albumId);
  if(!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
  let likedAlbum=await Like.findOne({userId});
  let likedAlbumArray=null;
  likedAlbum ? likedAlbumArray=likedAlbum.albumIds : likedAlbumArray=null; 
  if(likedAlbumArray && likedAlbumArray.includes(albumId)) throw new CustomError("Album already liked", StatusCodes.BAD_REQUEST);
  if(!likedAlbum){
    const newLikedAlbum=await Like.create({userId,albumIds:[albumId]});
  }
  else{
    likedAlbum.albumIds.push(albumId);
    await likedAlbum.save();
  }
  const albumUpdateResponse=await Album.findOneAndUpdate({_id:albumId},{$inc:{totalLikes:1}},{runValidators:true,new:true});
  res.status(StatusCodes.OK).json(albumUpdateResponse);
});


// remove like from album


const removeLikeAlbum = asyncWrapper(async (req, res) => {
  const albumId = req.params.albumId;
  const userId = req.user.id;
  if(!albumId) throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
  if(!userId) throw new CustomError("User id is required", StatusCodes.BAD_REQUEST);
  const album = await Album.findById(albumId);
  if(!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
  let likedAlbum=await Like.findOne({userId});
  let likedAlbumArray=null;
  likedAlbum ? likedAlbumArray=likedAlbum.albumIds : likedAlbumArray=null; 
  if(!likedAlbumArray || !likedAlbumArray.includes(albumId)) throw new CustomError("Album is not  liked", StatusCodes.BAD_REQUEST);
  likedAlbum.albumIds.pop(albumId);
  await likedAlbum.save();
  const albumUpdateResponse=await Album.findOneAndUpdate({_id:albumId},{$inc:{totalLikes:-1}},{runValidators:true,new:true});
  res.status(StatusCodes.OK).json(albumUpdateResponse);
});


const getAlbum = asyncWrapper(async (req, res) => {
  const albumId=req.params.albumId;
  if(!albumId) throw new CustomError("Album id is required", StatusCodes.BAD_REQUEST);
  const album=await Album.findById(albumId).populate("songsId");
  if(!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(album);
})



const getAlbums = asyncWrapper(async (req, res) => {
  const albums=await Album.find({});
  if(!albums) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(albums);
})


module.exports = {
  getSong,
  handleLikeSong,
  removeLikeSong,
  handleLikeAlbum,
  removeLikeAlbum,
  getAlbum,
  getAlbums
};

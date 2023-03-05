const asyncWrapper = require("../error/asyncWrapper");
const {
  validateAlbum,
  validateObjectId,
  validateAlbumUpdate,
  playListRemoveValidate,
} = require("../utils/joiValidate");
const CustomError = require("../error/custom");
const { StatusCodes } = require("http-status-codes");
const uploadImage = require("../utils/uploadImage");
const Album = require("../models/album");
const compressImage = require("../utils/compress");
const Song = require("../models/music");

//create album
const createAlbum = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
  if (!req.body.data)
    throw new CustomError("Album data is required", StatusCodes.BAD_REQUEST);
  const data = JSON.parse(req.body.data);
  const { error } = validateAlbum(data);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  if (!req.file)
    throw new CustomError("Album image is required", StatusCodes.BAD_REQUEST);
  await compressImage(req);
  const url = await uploadImage(req.file.path);
  const albumData = { ...data, artistId, albumImage: url };
  const album = await Album.create(albumData);
  res.status(StatusCodes.CREATED).json(album);
});

//delete album

const deleteAlbum = asyncWrapper(async (req, res) => {
  const { albumId } = req.params;
  const { error } = validateObjectId({ id: albumId });
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const album = await Album.findByIdAndDelete(albumId);
  if (!album) throw new CustomError("Album not found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(album);
});

//get album by id

const getAlbumById = asyncWrapper(async (req, res) => {
  const { albumId } = req.params;
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
  if (!albumId)
    throw new CustomError("Album id not present", StatusCodes.BAD_REQUEST);
  const album = await Album.findOne({ artistId, _id: albumId }).populate(
    "songsId"
  );
  if (!album) throw new CustomError("album not present", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(album);
});

//get all albums

const getAllAlbums = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
  const albums = await Album.find({ artistName: artistId }).sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json(albums);
});

const updateAlbum = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  const albumId = req.params.albumId;
  if (!albumId)
    throw new CustomError("Album id not present", StatusCodes.BAD_REQUEST);
  if (!artistId)
    throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
  let albumData = {};
  console.log(req.body);
  if (req.body.data) {
    const data = JSON.parse(req.body.data);
    const { error } = validateAlbumUpdate(data);
    if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
    console.log(data);
    albumData = { ...data };
  }
  if (req.file) {
    const url = await uploadImage(req.file.path);
    albumData.albumImage = url;
  }
  const album = await Album.findOneAndUpdate(
    { artistName: artistId, _id: albumId },
    albumData,
    { runValidators: true, new: true }
  );
  res.status(StatusCodes.CREATED).json(album);
});

const removeFromAlbum = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  const albumId = req.params.albumId;
  if (!albumId)
    throw new CustomError("Album id not present", StatusCodes.BAD_REQUEST);
  if (!artistId)
    throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
  const { error } = playListRemoveValidate(req.body);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const updateSongId = {
    $pull: {
      songsId: { $in: req.body.songsId },
    },
  };
  const album = await Album.findOneAndUpdate({ _id: albumId,artistId }, updateSongId, {
    runValidators: true,
    new: true,
  });
  if (!album)
    throw new CustomError("album not present", StatusCodes.BAD_REQUEST);
  res.status(StatusCodes.OK).json(album);
});

module.exports = {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  updateAlbum,
  removeFromAlbum,
};

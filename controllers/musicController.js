const asyncWrapper = require('../error/asyncWrapper');
const { validateSong, validateObjectId } = require('../utils/joiValidate');
const CustomError = require('../error/custom');
const { StatusCodes } = require('http-status-codes');
const uploadImage = require('../utils/uploadImage');
const uploadAudio = require('../utils/uploadSong');
const Song = require('../models/music');
const { getGenre, getLanguage } = require('../utils/getGenreLanguage');
const compressImage = require('../utils/compress');
const Album = require('../models/album');

//upload song
const uploadSong = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  if (!req.body.data)
    throw new CustomError('Song data is required', StatusCodes.BAD_REQUEST);
  const data = JSON.parse(req.body.data);
  const { error } = validateSong(data);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  if (!req.file)
    throw new CustomError('Song file is required', StatusCodes.BAD_REQUEST);
  const [url, genres, language] = await Promise.all([
    uploadAudio(req.file.path),
    getGenre(data.genres),
    getLanguage(data.language),
  ]);
  const songData = { ...data, genres, artistId, songFile: url, language };
  let song = await Song.create(songData);
  song = song.toObject();
  delete song.createdAt;
  delete song.updatedAt;
  delete song.__v;
  await Album.findOneAndUpdate(
    { _id: song.albumId, artistId },
    { $push: { songsId: song._id } },
    { runValidators: true, new: true }
  );
  res.status(StatusCodes.OK).json(song);
});

//upload song image
const uploadSongImage = asyncWrapper(async (req, res, next) => {
  const artistId = req.admin.id;
  const songId = req.params.songId;
  if (!songId)
    throw new CustomError('Song id is required', StatusCodes.BAD_REQUEST);
  if (!artistId)
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  if (!req.file)
    throw new CustomError('Song image is required', StatusCodes.BAD_REQUEST);
  await compressImage(req);
  const songImage = await uploadImage(req.file.path);
  const song = await Song.findOneAndUpdate(
    { _id: songId, artistId },
    { songImage },
    { runValidators: true, new: true }
  );
  if (!song) throw new CustomError('Song not found', StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(song);
});

//delete song

const deleteSong = asyncWrapper(async (req, res, next) => {
  const songId = req.params.songId;
  const { error } = validateObjectId({ id: songId });
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const song = await Song.findOne({ _id: songId, artistId });
  if (!song) throw new CustomError('Song not found', StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(song);
});

// get all song

const getAllSong = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  const songs = await Song.find({ artistId })
    .populate({
      path: 'albumId genres language songImage artistId',
      select: 'albumName genreName languageName name -_id',
    })
    .exec();
  if (!songs) throw new CustomError('Song not found', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).json(songs);
});

// get song by id

const getSongById = asyncWrapper(async (req, res) => {
  const songId = req.params.songId;
  if (!songId)
    throw new CustomError('Song id is required', StatusCodes.BAD_REQUEST);
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  const song = await Song.findOne({ _id: songId, artistId })
    .populate({
      path: 'albumId genres language songImage artistId',
      select: 'albumName genreName languageName name -_id',
    })
    .exec();
  if (!song) throw new CustomError('Song not found', StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(song);
});

module.exports = {
  uploadSong,
  uploadSongImage,
  deleteSong,
  getAllSong,
  getSongById,
};

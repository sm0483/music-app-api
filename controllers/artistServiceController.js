const { StatusCodes } = require('http-status-codes');
const asyncWrapper = require('../error/asyncWrapper');
const CustomError = require('../error/custom');
const { queryValidate } = require('../utils/joiValidate');
const Album = require('../models/album');
const Language = require('../models/language');
const Genre = require('../models/genre');

const getAlbumInfo = asyncWrapper(async (req, res) => {
  const artistId = req.admin.id;
  if (!artistId)
    throw new CustomError('Token not Valid', StatusCodes.UNAUTHORIZED);
  const [albumNameList, languageList, genreList] = await Promise.all([
    Album.find({ artistId }).select('albumName'),
    Language.find({}).select('languageName'),
    Genre.find({}).select('genreName'),
  ]);

  res.status(StatusCodes.OK).json({
    albumNameList,
    languageList,
    genreList,
  });
});

module.exports = { getAlbumInfo };

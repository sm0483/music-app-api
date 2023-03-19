// search bar request from client side
const asyncWrapper = require('../error/asyncWrapper');
const { StatusCodes } = require('http-status-codes');
const {
  searchMusicByGenre,
  searchMusicByLanguage,
  searchMusicByName,
  searchAlbum,
} = require('../utils/searchMusic');

const getResult = asyncWrapper(async (req, res) => {
  const query = req.params.query;
  if (!query) throw new CustomError('Invalid request', StatusCodes.BAD_REQUEST);
  const [musicByGenre, musicByLanguage, musicByName, albums] =
    await Promise.all([
      searchMusicByGenre(query),
      searchMusicByLanguage(query),
      searchMusicByName(query),
      searchAlbum(query),
    ]);

  const searchResult = {
    musicByGenre,
    musicByLanguage,
    musicByName,
    albums,
  };

  res.status(StatusCodes.OK).json(searchResult);
});

module.exports = {
  getResult,
};

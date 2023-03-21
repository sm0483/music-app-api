const Genre = require("../models/genre");
const Song = require("../models/music");
const Language = require("../models/language");
const Album = require("../models/album");
const CustomError = require("../error/custom");
const { StatusCodes } = require("http-status-codes");
const { searchAlbumByNamePipeline } = require("../pipelines/searchAlbum");

// search genre
const searchMusicByGenre = async (genreName) => {
   try {
      let searchResponse = [];
      const genre = await Genre.findOne({
         genreName: new RegExp("^" + genreName, "i"),
      });
      if (!genre) return searchResponse;
      const song = await Song.find({ genres: { $in: [genre._id] } })
         .populate({
            path: "artistId",
            select: "name -_id",
         })
         .populate({
            path: "albumId",
            select: "albumName -_id",
         })
         .exec();
      searchResponse = song;
      return searchResponse;
   } catch (err) {
      throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
   }
};

// search by language
const searchMusicByLanguage = async (languageName) => {
   try {
      let searchResponse = [];
      const language = await Language.findOne({
         languageName: new RegExp("^" + languageName, "i"),
      });
      if (!language) return searchResponse;
      const song = await Song.find({ language: language._id })
         .populate({
            path: "artistId",
            select: "name -_id",
         })
         .populate({
            path: "albumId",
            select: "albumName -_id",
         })
         .exec();
      searchResponse = song;
      return searchResponse;
   } catch (error) {
      throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   }
};

// search play list name

const searchAlbum = async (albumName) => {
   try {
      let searchResponse = [];
      const pipe = searchAlbumByNamePipeline(albumName);
      const album = await Album.aggregate(pipe);
      if (!album) return searchResponse;
      searchResponse = album;
      return searchResponse;
   } catch (error) {
      throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   }
};

const searchMusicByName = async (songName) => {
   try {
      let searchResponse = [];
      const song = await Song.find({
         songName: new RegExp("^" + songName, "i"),
      });
      searchResponse = song;
      return searchResponse;
   } catch (err) {
      throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
   }
};

module.exports = {
   searchMusicByGenre,
   searchMusicByLanguage,
   searchMusicByName,
   searchAlbum,
};

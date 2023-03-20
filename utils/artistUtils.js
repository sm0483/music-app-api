const Artist = require("../models/admin");
const Song = require("../models/music");

const getArtistNames = async (songs) => {
   const artistIds = songs.map((song) => song.artistId);
   const artists = await Artist.find(
      { _id: { $in: artistIds } },
      { name: 1, _id: 1 }
   );
   return artists.reduce((acc, artist) => {
      acc[artist._id] = artist.name;
      return acc;
   }, {});
};

const songsWithArtistNames = async (playList) => {
   const songs = playList[0].songs;
   const artistNames = await getArtistNames(songs);
   return songs.map((song) => ({
      ...song,
      artistName: artistNames[song.artistId],
   }));
};

module.exports = { songsWithArtistNames };

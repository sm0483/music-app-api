const { default: mongoose } = require('mongoose');

const getSongPipeline = (size, likedSong) => {
  return [
    { $sample: { size } },
    {
      $lookup: {
        from: 'artists',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artist',
      },
    },
    {
      $project: {
        'artist.email': 0,
        'artist.password': 0,
        'artist.verified': 0,
        'artist.profilePic': 0,
        'artist.description': 0,
        'artist.createdAt': 0,
        'artist.updatedAt': 0,
        'artist.__v': 0,
      },
    },
    {
      $project: {
        language: 0,
        genres: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
    {
      $addFields: {
        liked: { $in: ['$_id', likedSong.songIds] },
      },
    },
  ];
};

const getAlbumPipeline = (albumId, likedSong) => {
  return [
    {
      $match: { albumId: mongoose.Types.ObjectId(albumId) },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artist',
      },
    },
    {
      $project: {
        'artist.email': 0,
        'artist.password': 0,
        'artist.verified': 0,
        'artist.profilePic': 0,
        'artist.description': 0,
        'artist.createdAt': 0,
        'artist.updatedAt': 0,
        'artist.__v': 0,
      },
    },
    {
      $project: {
        language: 0,
        genres: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },

    {
      $addFields: {
        liked: { $in: ['$_id', likedSong.songIds] },
      },
    },
  ];
};

module.exports = {
  getSongPipeline,
  getAlbumPipeline,
};

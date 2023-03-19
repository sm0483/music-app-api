const { default: mongoose } = require('mongoose');

const getPlayListPipeline = (likedSong, playListId) => {
  return [
    {
      $match: { _id: mongoose.Types.ObjectId(playListId) },
    },
    {
      $lookup: {
        from: 'musics',
        localField: 'songsId',
        foreignField: '_id',
        as: 'songs',
      },
    },
    {
      $addFields: {
        songs: {
          $map: {
            input: '$songs',
            as: 'song',
            in: {
              $mergeObjects: [
                '$$song',
                { liked: { $in: ['$$song._id', likedSong.songIds] } },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        songsId: 0,
        'songs.genres': 0,
        'songs.createdAt': 0,
        'songs.updatedAt': 0,
        'songs.__v': 0,
        'songs.language': 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ];
};

module.exports = {
  getPlayListPipeline,
};

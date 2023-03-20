const getAlbumPipelineAlbum = (likedAlbum,size) => {
  return [
    { $sample: { size } },
    {
      $project: {
        _id: 1,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        songsId: 0,
      },
    },
    {
      $addFields: {
        liked: { $in: ['$_id', likedAlbum.albumIds] },
      },
    },
  ];
};

module.exports = {
  getAlbumPipelineAlbum,
};

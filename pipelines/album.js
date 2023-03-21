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
    {
      $lookup: {
        from: 'artists',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artist',
      }
    },{
      $project:{
        "artist._id":0,
        "artist.createdAt":0,
        "artist.updatedAt":0,
        "artist.__v":0,
        "artist.password":0,
        "artist.email":0,
        "artist.verified":0,
        artistId:0

      }
    }
  ];
};


module.exports = {
  getAlbumPipelineAlbum,
};

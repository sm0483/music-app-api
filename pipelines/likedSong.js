const getLikedSongPipeline = (likedSong, size) => {
   return [
      { $match: { _id: { $in: likedSong.songIds } } },
      {
         $lookup: {
            from: "artists",
            localField: "artistId",
            foreignField: "_id",
            as: "artist",
         },
      },
      {
         $project: {
            _id: 1,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            genres: 0,
            language: 0,
            artistId: 0,
            "artist.password": 0,
            "artist.createdAt": 0,
            "artist.updatedAt": 0,
            "artist.__v": 0,
            "artist.email": 0,
            "artist.verified": 0,
            "artist.profilePic": 0,
         },
      },
   ];
};


module.exports = {
   getLikedSongPipeline,
};

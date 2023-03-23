const mongoose = require("mongoose");

const likedSong = new mongoose.Schema({
   songIds: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Music",
      },
   ],
   albumIds: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Album",
      },
   ],
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
   },
});

module.exports = mongoose.model("Liked", likedSong);

const mongoose = require('mongoose');

const likedSong = new mongoose.Schema({
  songIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music',
      unique: true,
    },
  ],
  albumIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      unique: true,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
});

module.exports = mongoose.model('Liked', likedSong);

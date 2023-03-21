const mongoose = require("mongoose");

const connectDb = async (url) => {
   return mongoose.connect(url);
};

module.exports = { connectDb };

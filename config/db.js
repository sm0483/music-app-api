const mongoose = require('mongoose');

const connectDb = (url) => {
  mongoose.connect(url).then(() => {
    console.log('MongoDB Connected...');
  }
  ).catch(err => {
    console.log(err);
  }
  );
}

module.exports = {connectDb};

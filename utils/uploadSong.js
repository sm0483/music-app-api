const admin = require('../config/firebase');
const CustomError = require('../error/custom');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');

const uploadAudio = async (file) => {
  try {
    if (!file) return 'file not present';
    const remoteFilePath = `audio/${file}`;
    const bucket = admin.storage().bucket();
    const audioData = await bucket.upload(file, {
      destination: remoteFilePath,
      metadata: {
        contentType: 'audio/mpeg',
      },
    });
    const fileData = bucket.file(remoteFilePath);
    const url = await fileData.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    fs.unlinkSync(file);
    return url[0];
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
  }
};

module.exports = uploadAudio;

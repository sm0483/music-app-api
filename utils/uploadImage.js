const admin = require('../config/firebase');
const CustomError = require('../error/custom');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');

const uploadImage = async (file) => {
  try {
    if (!file) return 'file not present';
    const uncompressed = file;
    file = file + '.webp';
    const remoteFilePath = `image/${file}`;
    const bucket = admin.storage().bucket();
    const audioImage = await bucket.upload(file, {
      destination: remoteFilePath,
      metadata: {
        contentType: 'image/png',
      },
    });
    const fileData = bucket.file(remoteFilePath);
    const url = await fileData.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    fs.unlinkSync(file);
    fs.unlinkSync(uncompressed);
    return url[0];
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
  }
};

module.exports = uploadImage;

const sharp = require('sharp');
const path = require('path');
const CustomError = require('../error/custom');
const { StatusCodes } = require('http-status-codes');

const compressImage = async (req) => {
  try {
    console.log(req.file.path);
    await sharp(req.file.path)
      .webp({ quality: 80 })
      .toFile(path.join('uploads', `${req.file.filename}.webp`));
  } catch (error) {
    throw new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = compressImage;

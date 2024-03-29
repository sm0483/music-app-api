const joi = require('joi');

const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(4).required(),
  });
  return schema.validate(data);
};

const validateArtistUpdate = (data) => {
  const schema = joi.object({
    name: joi.string().min(4),
    description: joi.string().min(10),
  });
  return schema.validate(data);
};

const updatePasswordValidation = (data) => {
  const schema = joi.object({
    currentPassword: joi.string().min(6).required(),
    newPassword: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateObjectId = (data) => {
  const schema = joi.object({
    id: joi.string().hex().length(24).required(),
  });
  return schema.validate(data);
};

const validateGenre = (data) => {
  const schema = joi.object({
    genreName: joi.string().min(2).required(),
  });

  return schema.validate(data);
};

const validateLanguage = (data) => {
  const schema = joi.object({
    languageName: joi.string().min(2).required(),
  });

  return schema.validate(data);
};

const validateAlbum = (data) => {
  const schema = joi.object({
    albumName: joi.string().min(2).required(),
  });

  return schema.validate(data);
};

const validateAlbumUpdate = (data) => {
  const schema = joi.object({
    albumName: joi.string().min(2),
  });

  return schema.validate(data);
};

const validateSong = (data) => {
  const schema = joi.object({
    songName: joi.string().min(2).required(),
    albumId: joi.string().hex().length(24).required(),
    language: joi.string().min(2).required(),
    genres: joi.array().items(joi.string().min(2)).required(),
  });

  return schema.validate(data);
};

const playListValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(2).required(),
    songsId: joi.array().items(joi.string().hex().length(24)).required(),
  });

  return schema.validate(data);
};

const playListUpdateValidate = (data) => {
  const schema = joi.object({
    name: joi.string().min(2),
    songsId: joi.array().items(joi.string().hex().length(24)).required(),
  });

  return schema.validate(data);
};

const playListRemoveValidate = (data) => {
  const schema = joi.object({
    songsId: joi.array().items(joi.string().hex().length(24)).required(),
  });

  return schema.validate(data);
};

const queryValidate = (data) => {
  const schema = joi.object({
    count: joi.number().integer().min(1).max(10).required(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  updatePasswordValidation,
  validateObjectId,
  validateGenre,
  validateLanguage,
  validateAlbum,
  validateSong,
  playListValidation,
  playListUpdateValidate,
  validateArtistUpdate,
  validateAlbumUpdate,
  playListRemoveValidate,
  queryValidate,
};

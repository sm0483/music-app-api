const asyncWrapper = require('../error/asyncWrapper');
const Language = require('../models/language');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../error/custom');
const { validateObjectId, validateLanguage } = require('../utils/joiValidate');

//create Language

const createLanguage = asyncWrapper(async (req, res) => {
  const { error } = validateLanguage(req.body);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const language = await Language.create(req.body);
  res.status(StatusCodes.CREATED).json(language);
});

//update genre
const updateLanguage = asyncWrapper(async (req, res) => {
  const { error } = validateObjectId({ id: req.params.languageId });
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const { error: err } = validateLanguage(req.body);
  if (err) throw new CustomError(err.message, StatusCodes.BAD_REQUEST);
  const updateLanguageData = Language.findOneAndUpdate(
    { _id: req.params.languageId },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json(updateLanguageData);
});

//delete genre

const deleteLanguage = asyncWrapper(async (req, res) => {
  const { error } = validateObjectId({ id: req.params.languageId });
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const language = await Language.findByIdAndDelete(req.params.languageId);
  if (!language)
    throw new CustomError('Language not found', StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(language);
});

//get genre
const getLanguage = asyncWrapper(async (req, res) => {
  const { error } = validateObjectId({ id: req.params.languageId });
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const language = await Language.findById(req.params.languageId);
  if (!language)
    throw new CustomError('Language not found', StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json(language);
});

//get all genres
const getAllLanguage = asyncWrapper(async (req, res) => {
  const languages = await Language.find();
  res.status(StatusCodes.OK).json(languages);
});

module.exports = {
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getLanguage,
  getAllLanguage,
};

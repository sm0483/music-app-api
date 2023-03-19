const asyncWrapper = require('../error/asyncWrapper');
const Admin = require('../models/admin');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../error/custom');
const { createJwt, tokenValid } = require('../utils/jwt');
const { hashPassword } = require('../utils/bcrypt');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  validateArtistUpdate,
} = require('../utils/joiValidate');
const sendEmail = require('../utils/mailer');
const tokenType = require('../constants/tokenType');
const uploadImage = require('../utils/uploadImage');
const compressImage = require('../utils/compress');

const createArtist = asyncWrapper(async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  }
  const emailAlreadyExists = await Admin.findOne({ email: req.body.email });
  if (emailAlreadyExists) {
    throw new CustomError('Email already exists', StatusCodes.CONFLICT);
  }
  let response = await Admin.create(req.body);
  response = response.toObject();
  delete response.password;
  const verificationToken = createJwt(
    { id: response._id },
    tokenType.verifyEmail
  );
  const url = `${process.env.DOMAIN}/api/v1/artist/auth/verify/${verificationToken}`;
  const mailStatus = await sendEmail(req.body.email, url);

  res.status(StatusCodes.CREATED).json(response);
});

const verifyArtist = asyncWrapper(async (req, res) => {
  const token = req.params.token;
  if (!token) throw new CustomError('invalid email', StatusCodes.UNAUTHORIZED);
  const isValid = tokenValid(token, tokenType.verifyEmail);
  const { id } = isValid.payload;
  if (!id) throw new CustomError('invalid email', StatusCodes.UNAUTHORIZED);
  let response = await Admin.findByIdAndUpdate(
    id,
    { verified: true },
    { runValidators: true, new: true }
  );
  response = response.toObject();
  delete response.password;
  if (!isValid)
    throw new CustomError('invalid email', StatusCodes.UNAUTHORIZED);
  res.status(StatusCodes.OK).json({
    message: 'email verified',
    ...response,
  });
});

const loginArtist = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const admin = await Admin.findOne({ email });
  if (!admin) throw new CustomError('Email not found', StatusCodes.FORBIDDEN);
  const isValid = await admin.comparePassword(password);
  if (!isValid)
    throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  if (!admin.verified) {
    const verificationToken = createJwt(
      { id: admin._id },
      tokenType.verifyEmail
    );
    const url = `${process.env.DOMAIN}/api/v1/artist/auth/verify/${verificationToken}`;
    const mailStatus = await sendEmail(req.body.email, url);
    throw new CustomError('Mail send verify email', StatusCodes.UNAUTHORIZED);
  }
  const id = admin._id.toString();
  const token = createJwt({ id, type: tokenType.admin }, tokenType.admin);
  res.status(StatusCodes.OK).json({ token });
});

const getArtist = asyncWrapper(async (req, res) => {
  const { id } = req.admin;
  if (!id) throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  let response = await Admin.findById(id);
  response = response.toObject();
  delete response.password;
  delete response.createdAt;
  delete response.updatedAt;
  delete response.__v;
  if (!response)
    throw new CustomError('No admin found', StatusCodes.BAD_REQUEST);
  res.status(StatusCodes.OK).json(response);
});

const updateArtist = asyncWrapper(async (req, res) => {
  if (!req.body.data)
    throw new CustomError('Invalid data', StatusCodes.BAD_REQUEST);
  const data = JSON.parse(req.body.data);
  const { error } = validateArtistUpdate(data);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  const id = req.admin.id;
  if (!id) throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  if (req.file) {
    await compressImage(req);
    const profilePic = await uploadImage(req.file.path);
    data.profilePic = profilePic;
  }
  let updateArtist = await Admin.findOneAndUpdate({ _id: id }, data, {
    runValidators: true,
    new: true,
  });
  if (!updateArtist)
    throw new CustomError('No artist present', StatusCodes.NOT_FOUND);
  updateArtist = updateArtist.toObject();
  delete updateArtist.password;
  delete updateArtist.createdAt;
  delete updateArtist.updatedAt;
  delete updateArtist.__v;
  if (!updateArtist)
    throw new CustomError('No artist present', StatusCodes.BAD_REQUEST);
  res.status(StatusCodes.OK).json(updateArtist);
});

const updatePassword = asyncWrapper(async (req, res) => {
  const { id } = req.admin;
  if (!id) throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  const { error } = updatePasswordValidation(req.body);
  if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
  let { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin.id);
  const isValid = await admin.comparePassword(currentPassword);
  if (!isValid)
    throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  if (!id) throw new CustomError('Invalid Credential', StatusCodes.FORBIDDEN);
  password = await hashPassword(newPassword);
  const response = await Admin.findOneAndUpdate(
    { _id: id },
    { password },
    { runValidators: true, new: true }
  );
  res.status(StatusCodes.OK).json({
    message: 'Password successfully updated',
  });
});

const logoutArtist = asyncWrapper(async (req, res) => {
  const accessToken = '';
  res.status(StatusCodes.OK).json({ accessToken, message: 'Logged out' });
});

module.exports = {
  createArtist,
  verifyArtist,
  getArtist,
  loginArtist,
  updatePassword,
  logoutArtist,
  updateArtist,
};

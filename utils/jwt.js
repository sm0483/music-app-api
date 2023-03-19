const jwt = require('jsonwebtoken');
const { admin, user, verifyEmail } = require('../constants/tokenType');

const createJwt = (payload, type) => {
  let token = null;
  if (type === admin)
    token = jwt.sign({ payload }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.LIFETIME,
    });
  else if (type === user)
    token = jwt.sign({ payload }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.LIFETIME,
    });
  else if (type === verifyEmail)
    token = jwt.sign({ payload }, process.env.VERIFY_EMAIL, {
      expiresIn: process.env.LIFETIME,
    });

  return token;
};

const tokenValid = (token, type) => {
  let isValid = false;
  if (type === admin) isValid = jwt.verify(token, process.env.ACCESS_TOKEN);
  else if (type === user) isValid = jwt.verify(token, process.env.ACCESS_TOKEN);
  else if (type === verifyEmail)
    isValid = jwt.verify(token, process.env.VERIFY_EMAIL);

  return isValid;
};

module.exports = {
  createJwt,
  tokenValid,
};

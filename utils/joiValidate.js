const joi = require("joi");

const registerValidation=(data)=> {
  const schema = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
}

const loginValidation=(data)=>{
  const schema = joi.object({
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
}

const updateUserValidation=(data)=>{
  const schema=joi.object({
    name: joi.string().min(4).required()
  })
  return schema.validate(data);
}

const updatePasswordValidation=(data)=>{
  const schema=joi.object({
    password: joi.string().min(6).required(),
  })
  return schema.validate(data);
}


const validateObjectId=(data)=>{
  const schema=joi.object({
    id:joi.string().hex().length(24).required()
  })
  return schema.validate(data);
}




module.exports = { 
  registerValidation, 
  loginValidation,updateUserValidation,
  updatePasswordValidation,
  validateObjectId
};


const asyncWrapper = require('../error/asyncWrapper');
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt,tokenValid} = require("../utils/jwt");
const { hashPassword } = require("../utils/bcrypt");
const { registerValidation, loginValidation,
     updateUserValidation,updatePasswordValidation} = require("../utils/joiValidate");
const  sendEmail  = require("../utils/mailer");
const tokenType=require("../constants/tokenType");


const createUser=asyncWrapper(async (req, res) =>{
     const { error } = registerValidation(req.body);
     if (error) {
          throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
     }
     const emailAlreadyExists = await User.findOne({ email:req.body.email });
     if (emailAlreadyExists) {
       throw new CustomError("Email already exists",StatusCodes.CONFLICT);
     }
    let response=await User.create(req.body);
    response = response.toObject(); 
    delete response.password;
    const verificationToken=createJwt({id:response._id},tokenType.verifyEmail);
    const url=`${process.env.DOMAIN}/api/v1/user/auth/verify/${verificationToken}`;
    const mailStatus=await sendEmail(req.body.email,url);

    res.status(StatusCodes.CREATED).json(response);
});

const verifyUser=asyncWrapper(async (req, res) =>{
     const token=req.params.token;
     if(!token) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED );
     const isValid=tokenValid(token,tokenType.verifyEmail);
     const {id}=isValid.payload;
     if(!id) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED);
     let response=await User.findByIdAndUpdate(id,{verified:true},{runValidators:true,new:true});
     response = response.toObject();
     delete response.password;
     if(!isValid) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED);
     res.status(StatusCodes.OK).json({
          message:"email verified",
          ...response
     });
})

const loginUser=asyncWrapper(async(req,res)=>{
     const {email,password}=req.body;
     const {error}=loginValidation(req.body);
     if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
     const user = await User.findOne({ email });
     if(!user) throw new CustomError("User not found",StatusCodes.FORBIDDEN);
     if(!user.verified) throw new CustomError("Email not verified",StatusCodes.FORBIDDEN); 
     const isValid=await user.comparePassword(password);
     if(!isValid) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     const id=user._id.toString();
     const token=createJwt({id,type:tokenType.user},tokenType.user);
     res.status(StatusCodes.OK).json({token})
 })


 const getUser=asyncWrapper(async(req,res)=>{
    const {id}=req.user;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    let response=await User.findById(id);
    response = response.toObject();
    delete response.password;
    if(!response) throw new CustomError("No user found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json(response)
 })
 
 const updateUser=asyncWrapper(async(req,res)=>{
    const{id}=req.user;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const {error}=updateUserValidation(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    let updatedData=await User.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    updatedData = updatedData.toObject();
    delete updatedData.password;
    if(!updatedData) throw new CustomError("No user found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json(updatedData)
 })
 
 const updatePassword=asyncWrapper(async(req,res)=>{
     const {id}=req.user;
     if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     let {currentPassword,newPassword}=req.body;
     const {error}=updatePasswordValidation(req.body);
     const user = await User.findById(req.user.id);
     const isValid=await user.comparePassword(currentPassword);
     if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);  
     if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     password=await hashPassword(newPassword);
     const response=await User.findOneAndUpdate({_id:id},{password},{runValidators:true,new:true});
     res.status(StatusCodes.OK).json({
         message:"Password successfully updated"
     })
 })
 
 

 const logoutUser=asyncWrapper(async(req,res)=>{
     const accessToken="";
     res.status(StatusCodes.OK).json({accessToken,message:"Logged out"}); 
 })
 
 



module.exports = { 
     createUser,verifyUser,
     getUser,loginUser,updateUser,
     updatePassword,logoutUser
};



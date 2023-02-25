const asyncWrapper = require('../error/asyncWrapper');
const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const { createJwt,tokenValid} = require("../utils/jwt");
const { hashPassword } = require("../utils/bcrypt");
const { registerValidation, loginValidation,
     updateUserValidation,updatePasswordValidation} = require("../utils/joiValidate");
const  sendEmail  = require("../utils/mailer");
const tokenType=require("../constants/tokenType");


const createAdmin=asyncWrapper(async (req, res) =>{
     const { error } = registerValidation(req.body);
     if (error) {
          throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
     }
     const emailAlreadyExists = await Admin.findOne({ email:req.body.email });
     if (emailAlreadyExists) {
       throw new CustomError("Email already exists",StatusCodes.CONFLICT);
     }
    let response=await Admin.create(req.body);
    response = response.toObject(); 
    delete response.password;
    const verificationToken=createJwt({id:response._id},tokenType.verifyEmail);
    const url=`${process.env.DOMAIN}/api/v1/admin/auth/verify/${verificationToken}`;
    const mailStatus=await sendEmail(req.body.email,url);

    res.status(StatusCodes.CREATED).json(response);
});

const verifyAdmin=asyncWrapper(async (req, res) =>{
     const token=req.params.token;
     if(!token) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED );
     const isValid=tokenValid(token,tokenType.verifyEmail);
     const {id}=isValid.payload;
     if(!id) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED);
     let response=await Admin.findByIdAndUpdate(id,{verified:true},{runValidators:true,new:true});
     response = response.toObject();
     delete response.password;
     if(!isValid) throw new CustomError("invalid email",StatusCodes.UNAUTHORIZED);
     res.status(StatusCodes.OK).json({
          message:"email verified",
          ...response
     });
})

const loginAdmin=asyncWrapper(async(req,res)=>{
     const {email,password}=req.body;
     const {error}=loginValidation(req.body);
     if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
     const admin = await Admin.findOne({ email });
     if(!admin.verified) throw new CustomError("Email not verified",StatusCodes.FORBIDDEN); 
     if(!admin) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     const isValid=await admin.comparePassword(password);
     if(!isValid) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     const id=admin._id.toString();
     const token=createJwt({id,type:tokenType.admin},tokenType.admin);
     res.status(StatusCodes.OK).json({token})
 })


 const getAdmin=asyncWrapper(async(req,res)=>{
    const {id}=req.admin;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    let response=await Admin.findById(id);
    response = response.toObject();
    delete response.password;
    if(!response) throw new CustomError("No admin found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json(response)
 })
 
 const updateAdmin=asyncWrapper(async(req,res)=>{
    const{id}=req.admin;
    if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
    const {error}=updateUserValidation(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    let updatedData=await Admin.findOneAndUpdate({_id:id},req.body,{runValidators:true,new:true});
    updatedData = updatedData.toObject();
    delete updatedData.password;
    if(!updatedData) throw new CustomError("No admin found",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json(updatedData)
 })
 
 const updatePassword=asyncWrapper(async(req,res)=>{
     const {id}=req.admin;
     if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     let {password}=req.body;
     const {error}=updatePasswordValidation(req.body);
     if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);  
     if(!id) throw new CustomError("Invalid Credential",StatusCodes.FORBIDDEN);
     password=await hashPassword(password);
     const response=await Admin.findOneAndUpdate({_id:id},{password},{runValidators:true,new:true});
     res.status(StatusCodes.OK).json({
         message:"Password successfully updated"
     })
 })
 
 
 const logoutAdmin=asyncWrapper(async(req,res)=>{
     const accessToken="";
     res.status(StatusCodes.OK).json({accessToken,message:"Logged out"}); 
 })
 
 



module.exports = { 
     createAdmin,verifyAdmin,
     getAdmin,loginAdmin,updateAdmin,
     updatePassword,logoutAdmin
};



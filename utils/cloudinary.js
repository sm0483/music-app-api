const asyncWrapper = require("../error/asyncWrapper");
const fileUpload = require('express-fileupload');
const cloudConfig=require("../config/cloudinary");
const cloudinay=require('cloudinary');


const  uploadFile=async(file)=>{
    try{
        const result=await cloudinay.uploader.upload(file.tempFilePath,{
            public_id:`${Date.now()}`,
            resource_type:"auto",
            folder:"images"
        });
    
        return result.url;
    }    
    catch (error) {
        console.log(error);
    }
    
}


module.exports =uploadFile;
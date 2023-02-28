const asyncWrapper=require('../error/asyncWrapper');
const {validateSong,validateObjectId}=require("../utils/joiValidate");
const CustomError = require("../error/custom");
const {StatusCodes}=require("http-status-codes");
const uploadImage = require('../utils/uploadImage');
const uploadAudio=require('../utils/uploadSong');
const Song=require("../models/music");
const fs=require('fs');
const mongodb=require('mongodb');


//create song

// const createSong=asyncWrapper(async(req,res,next)=>{
//     const artistId=req.admin.id;
//     if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
//     const data=JSON.parse(req.body.data);
//     const {error}=validateSong(data);
//     if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
//     if(!req.files) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
//     if(req.files && !req.files.songFile) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
//     if(req.files && !req.files.songImage) throw new CustomError("Song image is required",StatusCodes.BAD_REQUEST);
//     const [songImage,songFile]=await Promise.all([
//         uploadFile(req.files.songImage),
//         uploadAudio(req.files.songFile)
//     ]);

//     const songData={...data,artistName:artistId,songFile,songImage}
//     const song=await Song.create(songData);
//     res.status(StatusCodes.OK).json(songData);
// })



//upload song
const uploadSong=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    const data=JSON.parse(req.body.data);
    const url=await uploadAudio(req.file.path);
    const {error}=validateSong(data);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!req.files) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
    if(req.files && !req.files.songFile) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
    const songFile=await uploadAudio(req.files.songFile);
    const songData={...data,artistName:artistId,songFile}
    const song=await Song.create(songData);
    res.status(StatusCodes.OK).json(songData);

})

//upload song image
const uploadSongImage=asyncWrapper(async(req,res,next)=>{
    const artistId=req.admin.id;
    const songId=req.params.songId;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!req.files) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
    if(req.files && !req.files.songImage) throw new CustomError("Song image is required",StatusCodes.BAD_REQUEST);
    const songImage=await uploadAudio(req.files.songImage);
    const song=await Song.findOneAndUpdate({_id:songId},{songImage},{runValidators:true,new:true});
    res.status(StatusCodes.OK).json(song);
})

//delete song

const deleteSong=asyncWrapper(async(req,res,next)=>{
    const songId=req.params.songId;
    const {error}=validateObjectId(songId);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const song=await Song.findByIdAndDelete(songId);
    if(!song) throw new CustomError("Song not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(song);
})




module.exports={
    uploadSong,
    uploadSongImage,
    deleteSong,

}

const asyncWrapper=require('../error/asyncWrapper');
const {validateSong,validateObjectId}=require("../utils/joiValidate");
const CustomError = require("../error/custom");
const {StatusCodes}=require("http-status-codes");
const uploadImage = require('../utils/uploadImage');
const uploadAudio=require('../utils/uploadSong');
const Song=require("../models/music");
const {getGenre,getLanguage}=require("../utils/getGenreLanguage");


//upload song
const uploadSong=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    const data=JSON.parse(req.body.data);
    const {error}=validateSong(data);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!req.file) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
    const [url,genres,language]=await Promise.all([
        uploadAudio(req.file.path),
        getGenre(data.genres),
        getLanguage(data.language)
    ]);
    const songData={...data,genres, artistName:artistId,songFile:url,language};
    let song=await Song.create(songData);
    song=song.toObject();
    delete song.createdAt;
    delete song.updatedAt;
    delete song.__v;
    res.status(StatusCodes.OK).json(song);
})

//upload song image
const uploadSongImage=asyncWrapper(async(req,res,next)=>{
    const artistId=req.admin.id;
    const songId=req.params.songId;
    if(!songId) throw new CustomError("Song id is required",StatusCodes.BAD_REQUEST);
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    if(!req.file) throw new CustomError("Song file is required",StatusCodes.BAD_REQUEST);
    const songImage=await uploadImage(req.file.path);
    const song=await Song.findOneAndUpdate({_id:songId,artistName:artistId},{songImage},{runValidators:true,new:true});
    if(!song) throw new CustomError("Song not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(song);
})

//delete song

const deleteSong=asyncWrapper(async(req,res,next)=>{
    const songId=req.params.songId;
    const {error}=validateObjectId({id:songId});
    const artistId=req.admin.id;
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const song=await Song.findOne({_id:songId,artistName:artistId});
    if(!song) throw new CustomError("Song not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(song);
})




module.exports={
    uploadSong,
    uploadSongImage,
    deleteSong,

}

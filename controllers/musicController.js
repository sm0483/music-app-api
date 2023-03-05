const asyncWrapper=require('../error/asyncWrapper');
const {validateSong,validateObjectId}=require("../utils/joiValidate");
const CustomError = require("../error/custom");
const {StatusCodes}=require("http-status-codes");
const uploadImage = require('../utils/uploadImage');
const uploadAudio=require('../utils/uploadSong');
const Song=require("../models/music");
const {getGenre,getLanguage}=require("../utils/getGenreLanguage");
const {songsRedis,songRedis}=require("../constants/redisPrefix");
const {redisGet,redisSet}=require('../utils/redis');



//upload song
const uploadSong=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    if(!req.body.data) throw new CustomError("Song data is required",StatusCodes.BAD_REQUEST);
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
    if(!req.file) throw new CustomError("Song image is required",StatusCodes.BAD_REQUEST);
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
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const song=await Song.findOne({_id:songId,artistName:artistId});
    if(!song) throw new CustomError("Song not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(song);
})


// get all song

const getAllSong=asyncWrapper(async(req,res)=>{
    const artistName=req.admin.id;
    if(!artistName) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    let songs=await redisGet(artistName,songsRedis);
    if(!songs) {
        songs=await Song.find({artistName}).populate({
            path:'albumName genres language',
            select:'albumName genreName languageName -_id'
        });
        await redisSet(artistName,songsRedis,songs,120);
        console.log('cache not present');
    }
    res.status(StatusCodes.OK).json(songs);

})

// get song by id

const getSongById=asyncWrapper(async(req,res)=>{
    const songId=req.params.songId;
    if(!songId) throw new CustomError("Song id is required",StatusCodes.BAD_REQUEST);
    const artistName=req.admin.id;
    if(!artistName) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    let song=await redisGet(songId,songRedis);
    if(!song){
        song=await Song.findOne({_id:songId,artistName}).populate({
            path:'albumName genres language',
            select:'albumName genreName languageName -_id'
        });
        redisSet(songId,songRedis,song,120);
        console.log('cache not present');
    }
    res.status(StatusCodes.OK).json(song);

})



module.exports={
    uploadSong,
    uploadSongImage,
    deleteSong,
    getAllSong,
    getSongById
}

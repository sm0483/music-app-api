const asyncWrapper = require('../error/asyncWrapper');
const Playlist = require('../models/playlist');
const {playListValidation,playListUpdateValidate}=require('../utils/joiValidate');
const { StatusCodes } = require('http-status-codes');
const CustomError = require("../error/custom");


//create playList
const createPlaylist = asyncWrapper(async (req, res) => {
    const {error}=playListValidation(req.body);
    req.body.userId=req.user.id;
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    let playList=await Playlist.create(req.body);
    playList=playList.toObject();
    res.status(StatusCodes.CREATED).json(playList);
});



//update playlist

const updatePlayList=asyncWrapper(async(req,res)=>{
    const playListId=req.params.playListId;
    if(!playListId) throw new CustomError("Invalid playList id",StatusCodes.BAD_REQUEST);
    const {error}=playListUpdateValidate(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const updateSongId = {
        $push: {
          songsId: { $each: req.body.songsId }
        },
    };
    if(req.body.name) updateSongId.name=req.body.name;
    const playList=await Playlist.findOneAndUpdate({_id:req.params.playListId},updateSongId,{runValidators:true,new:true})
    if(playList) throw new CustomError("playlist not present",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).json(playList);
})



//delete playlist

const deletePlayList=asyncWrapper(async(req,res)=>{
    const playListId=req.params.playListId;
    if(!playListId) throw new CustomError("Invalid playList id",StatusCodes.BAD_REQUEST);   
    const userId=req.user.id;
    if(!userId) throw new CustomError("Invalid request",StatusCodes.BAD_REQUEST);
    const song=await Playlist.findOneAndDelete({_id:playListId,userId:userId});
    if(!song) throw new CustomError("playlist not present",StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.BAD_REQUEST).json(song);
})


module.exports = {
    createPlaylist,
    updatePlayList,
    deletePlayList
}



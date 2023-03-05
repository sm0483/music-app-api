const asyncWrapper=require('../error/asyncWrapper');
const {validateAlbum,validateObjectId,validateAlbumUpdate}=require("../utils/joiValidate");
const CustomError = require("../error/custom");
const {StatusCodes}=require("http-status-codes");
const uploadImage = require('../utils/uploadImage');
const Album=require("../models/album");

//create album
const createAlbum=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    if(!req.body.data) throw new CustomError("Album data is required",StatusCodes.BAD_REQUEST);
    const data=JSON.parse(req.body.data);
    const {error}=validateAlbum(data);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!req.file) throw new CustomError("Album image is required",StatusCodes.BAD_REQUEST); 
    const url=await uploadImage(req.file.path);
    const albumData={...data,artistName:artistId,albumImage:url}
    const album=await Album.create(albumData);
    res.status(StatusCodes.CREATED).json(album);
})

//delete album

const deleteAlbum=asyncWrapper(async(req,res)=>{
    const {albumId}=req.params;
    const {error}=validateObjectId({id:albumId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const album=await Album.findByIdAndDelete(albumId);
    if(!album) throw new CustomError("Album not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(album);
})

//get album by id

const getAlbumById=asyncWrapper(async(req,res)=>{
    const {albumId}=req.params;
    const {error}=validateObjectId({id:albumId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const album=await Album.findById(albumId).populate('artistName','name');
    if(!album) throw new CustomError("Album not found",StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(album);
})

//get all albums

const getAllAlbums=asyncWrapper(async(req,res)=>{
    const albums=await Album.find();
    res.status(StatusCodes.OK).json(albums);
})


const updateAlbum=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    const albumId=req.params.albumId;
    if(!albumId) throw new CustomError("Album id not present",StatusCodes.BAD_REQUEST);
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    let albumData={};
    console.log(req.body);
    if(req.body.data){
        const data=JSON.parse(req.body.data);
        const {error}=validateAlbumUpdate(data);
        if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
        console.log(data);
        albumData={...data};
    }
    if(req.file){
        const url=await uploadImage(req.file.path);
        albumData.albumImage=url;
    }
    const album=await Album.findOneAndUpdate({artistName:artistId,_id:albumId},albumData,{runValidators:true,new:true});
    res.status(StatusCodes.CREATED).json(album);  
})


module.exports={
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums,
    updateAlbum
}
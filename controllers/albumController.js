const asyncWrapper=require('../error/asyncWrapper');
const {validateAlbum,validateObjectId}=require("../utils/joiValidate");
const CustomError = require("../error/custom");
const {StatusCodes}=require("http-status-codes");
const {uploadFile} = require('../utils/cloudinary');
const Album=require("../models/album");

//create album
const createAlbum=asyncWrapper(async(req,res)=>{
    const artistId=req.admin.id;
    if(!artistId) throw new CustomError("Token is not valid",StatusCodes.UNAUTHORIZED);
    const data=JSON.parse(req.body.data);
    const {error}=validateAlbum(data);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    if(!req.file) throw new CustomError("Album image is required",StatusCodes.BAD_REQUEST); 
    const url=await uploadFile(req.file);
    const albumData={...data,artistName:artistId,albumImage:url}
    const album=await Album.create(albumData);
    res.status(StatusCodes.CREATED).json(album)
})

//delete album

const deleteAlbum=asyncWrapper(async(req,res)=>{
    const {albumId}=req.params;
    const {error}=validateObjectId({id:albumId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const album=await Album.findByIdAndDelete(id);
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




module.exports={
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAllAlbums
}
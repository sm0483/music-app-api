
const asyncWrapper = require("../error/asyncWrapper");
const Genre = require("../models/genre");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error/custom");
const {validateObjectId,validateGenre}=require('../utils/joiValidate');


//create genre
const createGenre = asyncWrapper(async (req, res) => {
    const {error}=validateGenre(req.body);
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const genre = await Genre.create(req.body);
    res.status(StatusCodes.CREATED).json(genre);
})



//update genre
const updateGenre = asyncWrapper(async (req, res) => {
    const {error}=validateObjectId({id:req.params.genreId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const {error:err}=validateGenre(req.body);
    if(err) throw new CustomError(err.message,StatusCodes.BAD_REQUEST);
    const updateGenreData=Genre.findOneAndUpdate({_id:req.params.genreId},req.body,{new:true,runValidators:true});
    res.status(StatusCodes.OK).json(updateGenreData);

})

//delete genre

const deleteGenre = asyncWrapper(async (req, res) => {
    const {error}=validateObjectId({id:req.params.genreId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const genre = await Genre.findByIdAndDelete(req.params.genreId);
    if (!genre) throw new CustomError("Genre not found", StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(genre);
})


//get genre
const getGenre = asyncWrapper(async (req, res) => {
    const {error}=validateObjectId({id:req.params.genreId});
    if(error) throw new CustomError(error.message,StatusCodes.BAD_REQUEST);
    const genre = await Genre.findById(req.params.genreId);
    if (!genre) throw new CustomError("Genre not found", StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(genre);
})

//get all genres
const getAllGenres = asyncWrapper(async (req, res) => {
    const genres = await Genre.find();
    res.status(StatusCodes.OK).json(genres);
})


module.exports = {
    createGenre,
    updateGenre,
    deleteGenre,
    getGenre,
    getAllGenres
}


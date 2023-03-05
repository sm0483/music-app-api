const CustomError = require("../error/custom");
const Genre=require("../models/genre");
const Language=require("../models/language");
const {StatusCodes}=require("http-status-codes");

const getGenre=(genres)=>{
    try{
        const genreList=genres.map(async(genre)=>{
            const genreData= await Genre.findOne({ genreName: new RegExp('^' + genre, 'i') });
            if(genreData) return genreData._id.toString();
        })
        return Promise.all(genreList);
    }catch(err){
        throw new CustomError(err.message,StatusCodes.BAD_REQUEST);
    }
}


const getLanguage=async(language)=>{
    try {
        const languageData=await Language.findOne({languageName:new RegExp('^'+ language,'i')});
        if(!languageData) throw new CustomError("Language not found",StatusCodes.NOT_FOUND);
        if(languageData) return languageData._id.toString();       
    } catch (err) {
        throw new CustomError(err.message,StatusCodes.BAD_REQUEST);
    }
}


module.exports={getGenre,getLanguage};
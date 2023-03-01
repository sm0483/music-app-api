const Genre=require("../models/genre");
const Language=require("../models/language");

const getGenre=(genres)=>{
    try{
        const genreList=genres.map(async(genre)=>{
            const genreData= await Genre.findOne({ genreName: new RegExp('^' + genre, 'i') });
            return genreData._id.toString();
        })
        return Promise.all(genreList);
    }catch(err){
        return err;
    }
}


const getLanguage=async(language)=>{
    try {
        const languageData=await Language.findOne({languageName:new RegExp('^'+ language,'i')});
        if(!languageData) throw new CustomError("Language not found",StatusCodes.NOT_FOUND);
        return languageData._id.toString();       
    } catch (error) {
        return error;   
    }
}


module.exports={getGenre,getLanguage};
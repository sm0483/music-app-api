// search bar request from client side
const asyncWrapper = require('../error/asyncWrapper');
const { StatusCodes } = require("http-status-codes");
const Admin = require("../models/admin");
const Genre = require("../models/genre");
const Song=require("../models/music");
const Language = require("../models/language");
const Album=require("../models/album");

// search genre
const searchMusicByGenre=async(genreName)=>{
  try {
    const genre = await Genre.findOne({ genreName:new RegExp('^'+genreName,'i') });
    if (!genre) return null;
    const song = await Song.find({ genres: { $in: [genre._id] } })
    .populate({
        path:'artistName songFile songImage',
        select:'name'
    });
    return song;
  } catch (err) {
    return null
  }
}

// search by language
const searchMusicByLanguage=async(languageName)=>{
    try {
        const language=await Language.findOne({languageName:new RegExp('^'+languageName,'i')});
        if(!language) return null;
        const song=await Song.find({language:language._id})
        .populate({
            path:'artistName songFile songImage',
            select:'name'
        });

        return song;
    } catch (error) {
        return null;
        
    }
}

// search play list name

const searchAlbum=async(albumName)=>{
    try {
        const album=await Album.find({albumName: new RegExp('^'+albumName,'i')});
        if(!album) return null;
    } catch (error) {
        return null;
    }
}

const searchMusicByName=async(songName)=>{
    try{
        const song = await Song.find({ songName: new RegExp('^'+songName, 'i') });
        return song;
    }catch(err){
        console.log(err);
        return null;
    }
}

const getResult=asyncWrapper(async(req,res)=>{
    const query=req.params.query;
    const searchResponse=await Promise.all([
        searchMusicByGenre(query),
        searchMusicByLanguage(query),
        searchMusicByName(query),
        searchAlbum(query),
    ])

    const searchResult=searchResponse.filter((result)=>{
        if((result!==null || result!==undefined) && (result && result.length!==0)) return result;
    })

    res.status(StatusCodes.OK).json(searchResult)

})

module.exports={
    getResult
}
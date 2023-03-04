// search bar request from client side
const asyncWrapper = require('../error/asyncWrapper');
const { StatusCodes } = require("http-status-codes");
const {
    searchMusicByGenre,
    searchMusicByLanguage,
    searchMusicByName,
    searchAlbum
}=require("../utils/searchMusic");


const getResult=asyncWrapper(async(req,res)=>{
    const query=req.params.query;
    const searchResponse=await Promise.all([
        searchMusicByGenre(query),
        searchMusicByLanguage(query),
        searchMusicByName(query),
        searchAlbum(query),
    ])

    const searchResult=searchResponse.filter((result)=>{
        if((result!==null || result!==undefined) && (result && result.length!==0))return result;
    })

    res.status(StatusCodes.OK).json(searchResult)

})



module.exports={
    getResult
}
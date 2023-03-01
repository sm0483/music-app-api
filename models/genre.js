const mongoose=require('mongoose');


const genreSchema=new mongoose.Schema({
    genreName:{
        type:String,
        required:true
    }
});



module.exports=mongoose.model("Genre",genreSchema);
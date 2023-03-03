const mongoose=require('mongoose');


const playListSchema=new mongoose.Schema({
    name:{
        type:String,
        default:"New Playlist"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    songsId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Music"
    }]
},{timestamps:true});





module.exports=mongoose.model("Playlist",playListSchema);
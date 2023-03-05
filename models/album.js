const mongoose=require('mongoose');


const albumSchema=new mongoose.Schema({
    artistId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Artist',
        required:true
    },
    albumImage:{
        type:String,
        required:true
    },
    totalLikes:{
        type:Number,
        default:0
    },
    albumName:{
        type:String,
        required:true
    },
    songsId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Music'
    }]
    
},{timestamps:true});





module.exports=mongoose.model("Album",albumSchema);
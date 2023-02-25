const mongoose=require('mongoose');


const albumSchema=new mongoose.Schema({
    artistName:{
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
    }
    
},{timestamps:true});





module.exports=mongoose.model("Album",albumSchema);
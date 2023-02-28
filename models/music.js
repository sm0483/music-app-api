const mongoose=require('mongoose');


const musicSchema=new mongoose.Schema({
    songName:{
        type:String,
        required:true
    },
    artistName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Artist',
        required:true
    },
    albumName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Album',
        default:"Unknown"
    },
    songImage:{
        type:String,
    },
    songFile:{
        type:String,
        required:true
    },
    totalLikes:{
        type:Number,
        default:0
    },
    genres:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Genre',
    }],
    language:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Language',
    }
},{timestamps:true});





module.exports=mongoose.model("Music",musicSchema);
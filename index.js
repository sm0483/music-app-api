const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const root_dir = __dirname.split('src')[0]
dotenv.config({ path: path.join(root_dir, `.env`) });
const {connectDb} = require("./config/db");
const xss=require('xss-clean');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit')
const morgan=require('morgan');


app.use(morgan('dev'));



//routes

const userRoute=require("./routes/userAuthRoute");
const adminRoute=require("./routes/adminAuthRoute");
const genreRoute=require("./routes/genreRoute");
const languageRoute=require("./routes/languageRoute");
const albumRoute=require("./routes/albumRoute");
const songRoute=require("./routes/musicRoute");
const playListRoute=require("./routes/playListRoute");


//error handler
const errorHandler = require("./middleware/err");
const pageNotFound = require("./middleware/pageNotFound");
const cors = require('cors');

app.use(xss());
app.use(helmet());
app.use(cors());

app.use(rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
}))
app.use(express.json());
app.use(express.static("./public"));

  

app.get('/api/v1/live',(req, res) => {
  return res.status(200).json({ message: "alive" })
})




const start=async()=>{
  try{
      const connect=connectDb(process.env.MONGO_URI);
  }catch(err){
      console.log(err);
  }

}

start();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));




app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute)
app.use("/api/v1/genre",genreRoute);
app.use("/api/v1/language",languageRoute);
app.use("/api/v1/album",albumRoute);
app.use("/api/v1/song",songRoute);
app.use("/api/v1/playlist",playListRoute);




app.use(errorHandler);
app.use(pageNotFound);


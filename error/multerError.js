const { StatusCodes } = require('http-status-codes');
const multer=require('multer');

const multerError=(err,req,res,next)=>{
    if (err instanceof multer.MulterError) {
        res.status(400).json({
          message: err.message,
          status:StatusCodes.BAD_REQUEST,
        });
      } else {
        next(err);
    }
}

module.exports=multerError;
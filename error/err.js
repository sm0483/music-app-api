const { StatusCodes } = require('http-status-codes');
const CustomError=require('./custom');

const errorHandler=(err,req,res,next)=>{
    console.log(err);
    if(err instanceof CustomError){
        return res.status(err.status).json({ message: err.message, status: err.status });
    }
    res.status(500).json({ message: 'Internal server error',status:StatusCodes.INTERNAL_SERVER_ERROR });
}

module.exports=errorHandler;

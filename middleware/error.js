// creating a custom error handler for Express apps to handle errors in one place instead of writing repetitive error-handling code everywhere.

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}


export const errorMiddleware = (err,req,res,next)=>{
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if(err.code === 11000){
    const message= `Dublicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message,400)
  }

    if(err.name === 'JsonWebTokenError'){
    const message= `json Web Token Is Invalid . Try Again!`;
    err = new ErrorHandler(message,400)
  }

    if(err.name === 'TokenExpireError'){
    const message= `json Web Token Is Expired . Try To Login!`;
    err = new ErrorHandler(message,400)
  }

    if(err.name === 'CastError'){
    const message= `Invalid ${err.path}`;
    err = new ErrorHandler(message,400)
  }

  const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;

  return  res.status(err.statusCode).json({
    success: false,
    message: errorMessage
  })
}

export default ErrorHandler;
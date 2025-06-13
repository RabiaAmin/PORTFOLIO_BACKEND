import {User} from "../models/user.model.js"
import {catchAsyncErrors} from "./catchAsyncErrors.js"
import ErrorHandler from "./error.js"
import  JWT  from "jsonwebtoken"


export const isAuthenticated = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("User Not Authenticated!",400));

    }


    const decoded  = JWT.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
})
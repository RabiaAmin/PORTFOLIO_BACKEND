import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar And Resume Are Required!", 400));
  }

  const { avatar, resume } = req.files;

  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "AVATARS",
    }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResponseForAvatar.error || "unknown Cloudinary Error"
    );
  }

  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    {
      folder: "RESUME",
    }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResponseForResume.error || "unknown Cloudinary Error"
    );
  }

  const {
    username,
    email,
    phone,
    password,
    aboutMe,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedInUrl,
  } = req.body;


  const user = await User.create({
    username,
    email,
    phone,
    password,
    aboutMe,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedInUrl,
    avatar:{
        public_id: cloudinaryResponseForAvatar.public_id,
        url: cloudinaryResponseForAvatar.secure_url
    },
    resume:{
        public_id: cloudinaryResponseForResume.public_id,
        url: cloudinaryResponseForResume.secure_url
    },
  })


  generateToken(user,"user Registered!",201,res)
});



export const login = catchAsyncErrors(async (req,res,next)=>{
  const {email, password} = req.body;
  if(!email || !password) {
    return next(new ErrorHandler("Email & Password Are Required!"))
  }

  const user = await User.findOne({
    email
  }).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid Email Or Password!"))
  }

  const isPasswordMatched = await user.comparePassword(password);

  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid Email or Password!"))
  }

  generateToken(user, "LoggedIn",200,res);
});


export const logout = catchAsyncErrors(async (req,res,next)=>{
  res.status(200).cookie("token","",{
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: "Loggout"
  })
});

import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../middleware/error.js";
import { Skills } from "../models/skills.model.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async(req,res,next)=>{
const { category, skills } = req.body;

  if (!category || !skills || !Array.isArray(skills) || skills.length === 0) {
    return next(new ErrorHandler("Category and skills array are required", 400));
  }

  // Create a new skill document
  const newSkill = await Skills.create({
    category,
    skills,
  });

  res.status(201).json({
    success: true,
    message: "Skills added successfully",
    skill: newSkill,
  });
});

export const deleteSkill = catchAsyncErrors(async(req,res,next)=>{

});

export const updateSkill = catchAsyncErrors(async(req,res,next)=>{

});
export const getAllSkill = catchAsyncErrors(async(req,res,next)=>{

});
export const getAllCategories = catchAsyncErrors(async(req,res,next)=>{

});

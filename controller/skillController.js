import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Skills } from "../models/skills.model.js";


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
    message: "New Skill Added Successfully",
    skill: newSkill,
  });
});

export const deleteSkill = catchAsyncErrors(async(req,res,next)=>{
const { id } = req.params;

  const skill = await Skills.findById(id);

  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
});

export const updateSkill = catchAsyncErrors(async(req,res,next)=>{
 const { id } = req.params;
  const { category, skills } = req.body;

 

  const updatedSkill = await Skills.findByIdAndUpdate(
    id,
    { category, skills },
    { new: true, runValidators: true, useFindAndModify:false }
  );

   if (!updatedSkill) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    updatedSkill,
  });
});
export const getAllSkill = catchAsyncErrors(async(req,res,next)=>{
 const skills = await Skills.find();
if (!skills) {
    return next(new ErrorHandler("Skills not found", 404));
  }
  res.status(200).json({
    success: true,
    skills,
  });
});

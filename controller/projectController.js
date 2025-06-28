import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Project } from "../models/project.model.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project  Image Is Required!"));
  }

  const { image } = req.files;
  const tags = JSON.parse(req.body.tags);
  const { title, Description, demoUrl, gitHubUrl } = req.body;

  if (!title || !Description || !tags) {
    return next(new ErrorHandler("Please Provide All Details!",400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    image.tempFilePath,
    { folder: "PROJECT IMAGE" }
  );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResponse.error || "unknown Cloudinary Error"
    );
    return next(new ErrorHandler("Failed to upload banner to cloudinary!",500))
  }

  const project = await Project.create({
    title, Description, tags, demoUrl, gitHubUrl, image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });


  res.status(201).json({
    success: true,
    message: "New Project Added Successfully!",
    project
  })
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });

});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const newProjectData = {
    title: req.body.title,
    Description: req.body.Description,
    tags: JSON.parse(req.body.tags),
    demoUrl: req.body.demoUrl,
    gitHubUrl: req.body.gitHubUrl,
  };

  if (req.files && req.files.image) {
    const image = req.files.image;

    const project = await Project.findById(id);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }

    const projectImageId = project.image.public_id;
    await cloudinary.uploader.destroy(projectImageId);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "PROJECT IMAGE", 
      }
    );

    newProjectData.image = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const project = await Project.findByIdAndUpdate(id, newProjectData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Project Updated",
    project,
  });
});

export const getAllProject = catchAsyncErrors(async (req, res, next) => {
   const project = await Project.find();
if (!project) {
    return next(new ErrorHandler("Porject not found", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});


export const getSingleProject = catchAsyncErrors(async (req,res,next)=>{
     const {id} = req.params;
     const project = await Project.findById(id);

     if(!project){
      return next(new ErrorHandler("Porject Not Found",404));
     }

     res.status(200).json({
      success: true,
      project
     })
});

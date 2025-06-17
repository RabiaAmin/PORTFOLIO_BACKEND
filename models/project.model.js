import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    Description: String,
    tags: {
      type: [String],
      required: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    demoUrl: String,
    gitHubUrl: String,
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);

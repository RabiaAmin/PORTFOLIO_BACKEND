import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
});

const SkillsDataSchema = new mongoose.Schema({
  skillsData: [skillSchema],
});


export const Skills = mongoose.model("Skills", SkillsDataSchema);

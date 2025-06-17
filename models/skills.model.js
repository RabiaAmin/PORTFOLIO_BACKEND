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


export const Skills = mongoose.model("Skills", skillSchema);

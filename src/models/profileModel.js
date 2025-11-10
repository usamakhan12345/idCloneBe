import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String },
  resume: { type: String },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);

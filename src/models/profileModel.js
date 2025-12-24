import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  company: { type: String  ,  required: false},
  qualification: { type: String ,  required: false },
  certificate: { type: String  ,  required: false},
  adress: { type: String ,  required: true },
  experience: { type: String  ,  required: false},
  jobRole: { type: String ,  required: false },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);

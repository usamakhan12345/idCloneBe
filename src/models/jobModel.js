import mongoose from "mongoose";
const { Schema } = mongoose;

const jobSchema = new Schema({
  jobTitle: { type: String, required: true },
  location:  { type: String, required: true },
  salaryRange:     { type: String, required : true},
  jobDescription: { type: String , required : true }, 
  jobType :  { type: String, required: true },
  token :  { type: String, required: true },
  email: { type: String, required: true, lowercase: true },

}, { timestamps: true });

export const Job = mongoose.models.Jobs ||  mongoose.model('Jobs', jobSchema);
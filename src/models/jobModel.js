import mongoose from "mongoose";
const { Schema } = mongoose;

const jobSchema = new Schema({
  jobTitle: { type: String, required: true },
  location:  { type: String, required: true },
  salaryRange:     { type: String, required : true},
  jobDescription: { type: String , required : true }, 
  jobType :  { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

export const Job = mongoose.models.Jobs ||  mongoose.model('Jobs', jobSchema);
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String }, // Use String to support international numbers
  password:  { type: String, required: true },
  isVerified:  { type: Boolean, default : false },
  likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
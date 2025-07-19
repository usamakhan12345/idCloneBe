import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String },
  email:     { type: String, unique: true, lowercase: true },
  phoneNumber: { type: String }, // Use String to support international numbers
  password:  { type: String },
  isVerified:  { type: Boolean, default : false },
  likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' }],
  isGoogleLogin : {type : Boolean, default : false}
}, { timestamps: true });

export const User = mongoose.model('User', userSchema); 
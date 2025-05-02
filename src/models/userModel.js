import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String }, // Use String to support international numbers
  password:  { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
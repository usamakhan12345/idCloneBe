import mongoose from "mongoose";
import { Schema } from "mongoose";
const otpSchema = new Schema({
    email: {type : String },
    otpCode: { type: String, required: true },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },

}, { timestamps: true })


export const Otp = mongoose.model("Otp", otpSchema)
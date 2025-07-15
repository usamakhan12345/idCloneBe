import mongoose from "mongoose";
import { Schema } from "mongoose";
const otpSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    otpCode: { type: String, required: true },
    expiredAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },

}, { timestamps: true })


export const Otp = mongoose.model("Otp", otpSchema)
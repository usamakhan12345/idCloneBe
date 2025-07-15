import { Router } from "express";
import { generateOtp  , verifyOtp } from "../controllers/otpController.js";
import { authMiddleware } from "../middleware/index.js";

export const otpRouter = Router()

otpRouter.post("/api/generate-otp" ,generateOtp)
otpRouter.post("/api/verify-otp" ,verifyOtp)
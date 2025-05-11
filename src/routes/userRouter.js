import { Router } from "express";
import { SignUp } from "../controllers/userController.js";





export const userRouter = Router()

userRouter.post('/api/create-user' ,SignUp)
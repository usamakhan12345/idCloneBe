import { Router } from "express";
import { SignUp, signIn } from "../controllers/userController.js";





export const userRouter = Router()

userRouter.post('/api/create-user' ,SignUp)
userRouter.post('/api/sign-in' ,signIn)
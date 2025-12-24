import { Router } from "express";
import { SignUp, signIn  , createProfile} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/index.js";





export const userRouter = Router()

// Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });


userRouter.post('/api/create-user' ,SignUp)
userRouter.post('/api/sign-in' ,signIn)
userRouter.post('/api/create-profile' , [authMiddleware] , createProfile)
// userRouter.post('/api/create-profile' , [authMiddleware] ,   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "resume", maxCount: 1 },
//   ]) ,createProfile)
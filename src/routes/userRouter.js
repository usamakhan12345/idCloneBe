import { Router } from "express";
import { SignUp, signIn  , createProfile , getProfile} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/index.js";
import multer from "multer";





export const userRouter = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Images/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


userRouter.post('/api/create-user' ,SignUp)
userRouter.post('/api/sign-in' ,signIn)
userRouter.post('/api/create-profile' , [authMiddleware] , upload.fields([{name:'resume' , maxCount : 1}]) , createProfile)
userRouter.get('/api/get-profile', [authMiddleware]  , getProfile)


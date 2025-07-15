import { User } from "../models/userModel.js";
import { decodeToken } from "../utils/apiHelper.js";




export const   authMiddleware = async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1]
  if (!token) return res.status(401).send('Unauthorizeding');

  try {
   const decoded = decodeToken(token)

   const user = await User.findOne({ email: decoded.email })
   
   
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch(error) {
    res.status(401).send({message : error.message});
  }
}

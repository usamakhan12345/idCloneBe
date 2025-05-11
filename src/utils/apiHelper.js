import bcrypt from "bcryptjs"
import jwt from  'jsonwebtoken'
import { configDotenv } from "dotenv"

configDotenv()

export const bcryptPassword = async (password)=>{
    return  await bcrypt.hash(password, 10)
}

export const comparePassword = async(password , bcryptedPassword)=>{
  return await bcrypt.compare(password, bcryptedPassword); 
    
}

export const generateToken =  (email , firstName )=>{
   return  jwt.sign({email,firstName}, process.env.JWT_SCRET_KEY  , { expiresIn: 60 * 60 })

}
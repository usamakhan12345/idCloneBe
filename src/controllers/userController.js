import {User} from "../models/userModel.js"
import {validateUserSchema} from '../utils/joiSchemas.js'
import { bcryptPassword , comparePassword , generateToken } from "../utils/apiHelper.js"


export const SignUp = async(req ,res) =>{
    try{
        const {firstName , lastName , email , phoneNumber , password  } = req.body
        if(!firstName || !lastName || !email || !phoneNumber || !password ){
            return res.status(400).send("All fields are required")
        }


        const {error} =  validateUserSchema.validate(req.body)
        if(error){
            return res.status(400).send({
                message :error.message,
                status: 400
            })
        }

         const existingUser = await  User.findOne({email})

         if(existingUser){
            return res.status(409).send({
                message : "User ALready Exists",
                error : true ,
                status : 406

            })
         }

        const bcryptedPassword = await bcryptPassword(req.body.password)
        const newUser = new User(req.body)
         newUser.password  = bcryptedPassword

        
        await newUser.save()


    

        return res.send({
            message : "user created successfuly",
            user : newUser
        })


    }catch(error){
        return res.send({
            message:error.message
        })

    }
}



export const signIn = async(req,res) =>{
    try {
        console.log(req)
        const {email , password } = req.body

        if(!email ||  !password ){
            return res.status(400).send("All fields are required")
        }

    const existUser = await User.findOne({email})

      if(!existUser){
        return res.status(400).send({
            message : 'User Not Found',
            status :400 
        })
    }
    if(existUser){
        const isValidPassword =await  comparePassword(password, existUser.password); 
        if(isValidPassword){
          const token =  await generateToken(existUser.firstName, existUser.email)

          return res.status(200).send({
            message : "User Loggin Successfuly",
            token 
          })


        }else {
            return res.status(401).send({
                message : "Wrong Password",
                status : 401
            })
        }
    }

    


    }catch(error){
        return res.status(500).send({
            message : error.message,
        })
    }
}



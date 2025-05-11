import {User} from "../models/userModel.js"
import {validateUserSchema} from '../utils/joiSchemas.js'
import bcrypt from "bcryptjs"


export const SignUp = async(req ,res) =>{
    try{
        const {firstName , lastName , email , phoneNumber , password  } = req.body
        if(!firstName || !lastName || !email || !phoneNumber || !password ){
            return res.status(400).send("All fields are required")
        }


        const {error} =  validateUserSchema.validate(req.body)
       console.log({error})
        if(error){
            return res.status(400).send({
                message :error.message,
                status: 400
            })
        }

         const existingUser = await  User.findOne(req.body)

         console.log({existingUser})
         if(existingUser){
            return res.status(409).send({
                message : "User ALready Exists",
                error : true ,
                status : 406

            })
         }

        const bcryptedPassword =  await bcrypt.hash(req.body.password, 10); 
        const newUser = new User(req.body)
         newUser.password  = bcryptedPassword

        console.log({bcryptedPassword})
        
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



const signIn = async(req,res) =>{
    try {

    }catch(error){

    }
}



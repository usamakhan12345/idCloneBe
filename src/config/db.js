import mongoose from "mongoose";
import { configDotenv } from "dotenv";


configDotenv()
const mongoDbUrl = process.env.MONGO_DB_URL
export const connectDb =async()=>{
   try{
    const conn = await mongoose.connect(mongoDbUrl.toString())
        useNewUrlParser :true,
    console.log("Database Created Successfuly")
   }catch(error){

    console.log({error})

   }

}

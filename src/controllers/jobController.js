import jwt from "jsonwebtoken"; // if you're using JWT
import { Job } from "../models/jobModel.js";
import { User } from "../models/userModel.js";
import { validateJobScehma } from "../utils/joiSchemas.js";
import { configDotenv } from "dotenv";
import { decodeToken } from "../utils/apiHelper.js";


configDotenv()

export const createJob = async (req, res) => {
  try {
    const { jobTitle, location, salaryRange, jobDescription, jobType } = req.body;

    if (!jobTitle || !location || !salaryRange || !jobDescription || !jobType) {
      return res.status(400).send("All fields are required");
    }
    const authHeader =  req.headers.authorization

    const { error } = validateJobScehma.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: error.message,
        status: 400,
      });
    }


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Authorization token missing or malformed" });
      }


    const token = authHeader.split(" ")[1]

    const decodedToken = decodeToken(token)

    console.log({decodedToken})
    let user ;
    if(decodedToken){
         user = await User.findOne({ email: decodedToken.email });
        console.log("usererrr" , user)
        if (!user) {
          return res.status(404).send({ message: "User not found", status: 404 });
        }
    }else {
        return res.status(401).send({ message: "Authorization token missing or malformed" });


    }
        const newJob = new Job({
      jobTitle,
      location,
      salaryRange,
      jobDescription,
      jobType,
      createdBy: user._id, 
    });

    await newJob.save();

    return res.status(201).send({
      message: "Job Created Successfully",
      success: true,
      job: newJob,
    });
  } catch (error) {


    return res.status(500).send({
      message: error.message,
      status: 500,
    });
  }
};

export const getMyJobs = async(req,res) => {
    try{
    const token =  req.headers.authorization.split(" ")[1]
    const decodedToken = decodeToken(token)
   

    if(decodedToken){
        const user = await User.findOne({email: decodedToken.email})
        console.log("user" , user)
        if(!user){
            return res.status(409).send({
                message : "User not found",
                error  : true 
            })
        }
        const myJobs = await Job.find({createdBy : user._id}).populate('createdBy' , 'firstName lastName email')
        return res.status(200).send({
            message : "Get Jobs Successfuly",
            error : false,
            jobs: myJobs
        })
    }else {
        return res.status(401).send({
            message : "UnAuthorized",
            error : true 
        })

    }



    }catch(error){
        return res.status(500).send({
            message : error.message,
            error : true 
        })

    }

}


export const getAllJobs = async(req,res)=>{
  try{

    const allJobs = await Job.find({})

    if(!allJobs){
      return res.status(409).send({
        message : "Jobs are not available",
        error : true 
      })
    }

    return res.status(200).send({
      message : 'Get Jobs Successfuly',
      jobs : allJobs,
      numberOfResults : allJobs?.length
    })


  }catch(error){
    return res.status(500).send({
      message : error.message,
      error: true
    })
  }
}
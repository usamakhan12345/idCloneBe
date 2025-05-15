import { Job } from "../models/jobModel.js";
import { validateJobScehma } from "../utils/joiSchemas.js";




export const createJob =async (req,res)=>{
    try{
        const {jobTitle,location,salaryRange, jobDescription , jobType, email , token} = req.body
        if(!jobTitle || !location || !salaryRange || !jobDescription || !jobType || !email || !token  ){
            return res.status(400).send("All fields are required")

        }

   const {error} =  validateJobScehma.validate(req.body)
      if(error){
    return res.status(400).send({
        message :error.message,
        status: 400
    })
        }

    const newJob = new Job(req.body)

    await newJob.save()

    return res.status(200).send("Job Created Successfuly")

    }catch(error){
    return res.status(400).send(error?.message)
      

    }
}
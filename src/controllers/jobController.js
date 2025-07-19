import jwt from "jsonwebtoken"; // if you're using JWT
import { Job } from "../models/jobModel.js";
import { User } from "../models/userModel.js";
import { validateJobScehma } from "../utils/joiSchemas.js";
import { configDotenv } from "dotenv";
import { decodeToken } from "../utils/apiHelper.js";
import mongoose from "mongoose";


configDotenv()

export const createJob = async (req, res) => {
  try {
    const { jobTitle, location, salaryRange, jobDescription, jobType } = req.body;

    if (!jobTitle || !location || !salaryRange || !jobDescription || !jobType) {
      return res.status(400).send("All fields are required");
    }
    const authHeader = req.headers.authorization

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

    let user;
    if (decodedToken) {
      user = await User.findOne({ email: decodedToken.email });
      if (!user) {
        return res.status(404).send({ message: "User not found", status: 404 });
      }
    } else {
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

export const getMyJobs = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = decodeToken(token)


    if (decodedToken) {
      const user = await User.findOne({ email: decodedToken.email })
      if (!user) {
        return res.status(409).send({
          message: "User not found",
          error: true
        })
      }
      const myJobs = await Job.find({ createdBy: user._id }).populate('createdBy', 'firstName lastName email')
      return res.status(200).send({
        message: "Get Jobs Successfuly",
        error: false,
        jobs: myJobs,
        totalCount: myJobs?.length

      })
    } else {
      return res.status(401).send({
        message: "UnAuthorized",
        error: true
      })

    }



  } catch (error) {
    return res.status(500).send({
      message: error.message,
      error: true
    })

  }

}


export const getAllJobs = async (req, res) => {
  try {

    const allJobs = await Job.find({})

    if (!allJobs) {
      return res.status(409).send({
        message: "Jobs are not available",
        error: true
      })
    }

    return res.status(200).send({
      message: 'Get Jobs Successfuly',
      jobs: allJobs,
      numberOfResults: allJobs?.length
    })


  } catch (error) {
    return res.status(500).send({
      message: error.message,
      error: true
    })
  }
}



export const searchJobs = async (req, res) => {
  try {
    const { searchQuery, isOnlySavedJobs } = req.body
    const userId = req?.user?._id

    const searchedJobs = await Job.find({
      $or: [
        { jobTitle: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { jobDescription: { $regex: searchQuery, $options: 'i' } },
      ]
    })




    let likeJobsIds = []
    if (userId) {
      const user = await User.findById(userId).select('savedJobs')
      likeJobsIds = user?.savedJobs?.map(id => id.toString())
    }


    const jobsWithLikeStatus = searchedJobs.length > 0 && searchedJobs.map(job => ({
      ...job.toObject(),
      isSaved: likeJobsIds.includes(job._id.toString()),
    }));

    if (isOnlySavedJobs && userId) {
      const userSavedJobs = jobsWithLikeStatus.filter((job) => job.isSaved === true)
      return res.status(200).send({ message: "Saved jobs fetch  Successfuly", error: false, jobs: userSavedJobs, totalJobs: userSavedJobs.length })

    }

    if (jobsWithLikeStatus) {

      return res.status(200).send({ message: "Jobs Search Successfuly", error: false, jobs: jobsWithLikeStatus, totalJobs: jobsWithLikeStatus.length })
    }
    return res.status(200).send({ message: "No Jobs Found", error: false })


  } catch (error) {
    return res.status(200).send({ message: error.message, error: true })

  }
}


export const likedSavedJob = async (req, res) => {
  try {
    const { jobId, isLike, isSave } = req.body
    const user = req.user


    const currentUser = await User.findOne({ email: user.email })


    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID' });
    }
    if (isLike) {
      const findIndex = currentUser.likedJobs.indexOf(jobId)
      if (findIndex === -1) {
        currentUser.likedJobs.push(jobId)
      } else {
        currentUser.likedJobs.splice(findIndex, 1)

      }
    } else if (isSave) {

      const findIndex = currentUser.savedJobs.indexOf(jobId)
      if (findIndex === -1) {
        currentUser.savedJobs.push(jobId)
      } else {
        currentUser.savedJobs.splice(findIndex, 1)

      }

    }


    await currentUser.save()

    res.send({ likedJobs: currentUser.likedJobs, savedJobs: currentUser.savedJobs });


  } catch (error) {
    return res.send({ message: error.message })

  }
}


export const getMySavedLikedJobs = async (req, res) => {
  try {


    const { type } = req.query;
    const userEmail = req.user.email
    const projection = '-_id -createdBy -createdAt -updatedAt -password';
    const excludeField = type === 'savedJobs' ? '-likedJobs' : '-savedJobs';

    console.log("exclded", type, 'savedjobs', type == 'savedjobs', excludeField)

    const user = await User.findOne(
      { email: userEmail },
      `${projection} ${excludeField}`
    ).populate(type, '-_id -createdBy -createdAt -updatedAt');

    console.log("Userrrrrrrrrrr", user)

    return res.status(200).send({ message: user })


  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
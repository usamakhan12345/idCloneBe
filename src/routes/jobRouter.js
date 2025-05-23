import { Router } from "express";
import { createJob , getMyJobs , getAllJobs , searchJobs } from "../controllers/jobController.js";




export const jobRouter = Router()

jobRouter.post('/api/create-job' ,createJob)
jobRouter.get('/api/get-my-jobs' ,getMyJobs)
jobRouter.get('/api/get-all-jobs' ,getAllJobs)
jobRouter.post('/api/search' ,searchJobs)
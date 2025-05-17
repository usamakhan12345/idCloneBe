import { Router } from "express";
import { createJob , getMyJobs } from "../controllers/jobController.js";




export const jobRouter = Router()

jobRouter.post('/api/create-job' ,createJob)
jobRouter.get('/api/get-my-jobs' ,getMyJobs)
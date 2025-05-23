import { Router } from "express";
import { createJob, getMyJobs, getAllJobs, searchJobs, likedSavedJob, getMySavedLikedJobs } from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/index.js";




export const jobRouter = Router()

jobRouter.post('/api/create-job', createJob)
jobRouter.get('/api/get-my-jobs', getMyJobs)
jobRouter.get('/api/get-all-jobs', getAllJobs)
jobRouter.post('/api/search', searchJobs)
jobRouter.post('/api/save-like-job', [authMiddleware], likedSavedJob)
jobRouter.get('/api/get-save-like-jobs', [authMiddleware], getMySavedLikedJobs)
import { Router } from "express";
import { createJob } from "../controllers/jobController.js";




export const jobRouter = Router()

jobRouter.post('/api/create-job' ,createJob)
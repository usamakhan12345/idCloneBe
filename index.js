import express from "express";
import { configDotenv } from "dotenv";
const app = express()
import { connectDb } from "./src/config/db.js";
import { userRouter } from "./src/routes/userRouter.js";
import { jobRouter } from "./src/routes/jobRouter.js";
import cors from 'cors'
import { otpRouter } from "./src/routes/otpRouter.js";
configDotenv()

const port = process.env.PORT || 3000
connectDb()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([userRouter , jobRouter , otpRouter])

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
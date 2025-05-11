import express from "express";
import { configDotenv } from "dotenv";
const app = express()
import { connectDb } from "./src/config/db.js";
import { userRouter } from "./src/routes/userRouter.js";
import cors from 'cors'

configDotenv()

const port = process.env.PORT || 3000
connectDb()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([userRouter])

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
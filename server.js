import express from "express";
import { configDotenv } from "dotenv";
const app = express()
import { connectDb } from "./src/config/db.js";
configDotenv()

const port = process.env.PORT || 3000
connectDb()

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
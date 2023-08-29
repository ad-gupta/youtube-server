import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import commentRoute from "./routes/comments.js"
import videoRoute from "./routes/videos.js"
import authRoute from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from 'cors';
// import fileupload from 'express-fileupload'

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URI, {dbName: "youtube-clone"}).then(()=> {
        console.log("Connected to DB")
    }).catch((err) => {console.log(err)})
}

// app.use(fileupload({
//     useTempFiles: true
// }))
app.use(cors({
    origin: [
      "http://localhost:3000",
      "https://shortvideo.netlify.app",
    ],
    credentials: true,
  }))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auths", authRoute)
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/videos", videoRoute)


app.use((err, req, resp, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return resp.status(status).json({success: false, status, message})

})
  
app.listen(8000, ()=> {
    connect()
    console.log("server is connected on port 8000")
})
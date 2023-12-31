import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import commentRoute from "./routes/comments.js"
import videoRoute from "./routes/videos.js"
import authRoute from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from 'cors';
// import * as path from 'path'
// const __dirname = path.resolve();

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URI, {dbName: "youtube-clone"}).then(()=> {
        console.log("Connected to DB")
    }).catch((err) => {console.log(err)})
}

// app.use(express.static(path.join(__dirname, "./client/build")))

// app.get("*", (req, resp) => {
//     resp.sendFile(path.join(__dirname, './client/build/index.html'))
// })
// console.log(path.join(__dirname, './client/build/index.html'))

app.use(cors({
    origin: ['http://localhost:3000', 'https://shortsvideo.netlify.app'],
    credentials: true
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
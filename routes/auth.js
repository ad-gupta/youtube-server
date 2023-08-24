import express from "express";
import { logout, signin, signinWithGoogle, signup } from "../controllers/auth.js";
import multiUpload from "../multer.js";

const router = express.Router();

// CREATE A USER
router.post("/signup", multiUpload.single('imgUrl'), signup);

// SIGN IN
router.post("/signin", signin);

// GOOGLE AUTH
router.post("/google", signinWithGoogle);

router.get("/logout", logout)

export default router;

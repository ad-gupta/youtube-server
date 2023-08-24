import express from "express";
import {
  addLikeAndDislike,
  addVideo,
  addView,
  deleteVideo,
  getByTag,
  getVideo,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/videos.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);

router.put("/:id", verifyToken, updateVideo);

router.delete("/:id", verifyToken, deleteVideo);

router.get("/find/:id", getVideo);

router.put("/view/:id", addView);

router.get("/trend", trend);

router.get("/random", random);

router.get("/sub", verifyToken, sub);

router.put("/likeDislike/:id", verifyToken, addLikeAndDislike);

router.get("/tags", getByTag);

router.get("/search", search);

export default router;

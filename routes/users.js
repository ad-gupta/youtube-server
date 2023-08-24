import express from "express";
import {
  Delete,
  update,
  subscribe,
  unsubscribe,
  getUser,
  like,
  dislike,
} from "../controllers/users.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// update user
router.put("/:id", verifyToken, update);

// delete user
router.delete("/:id", verifyToken, Delete);

// get a user
router.get("/find/:id", getUser);

router.put("/like/:id", verifyToken, like)

router.put("/dislike/:id", verifyToken, dislike)

// subscribe a user
router.put("/sub/:id", verifyToken, subscribe);

// unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe);

export default router;

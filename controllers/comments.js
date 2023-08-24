import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, resp, next) => {
  try {
    const userId = req.user.id;
    const newComment = await Comment.create({ ...req.body, userId });
    resp.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, resp, next) => {
  try {
    //   const userId = req.user.id;
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    const video = await Video.findById(commentId);

    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(commentId);
      resp.status(200).json("Comment has been deleted.");
    } else {
      return next(createError(403, "You can delete only your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getComment = async (req, resp, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoid });
    resp.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

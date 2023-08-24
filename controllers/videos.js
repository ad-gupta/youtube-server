import getDataUri from "../dataUri.js";
import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { v2 as cloudinary } from "cloudinary";

let flag = 0;

cloudinary.config({
  cloud_name: "dfzsw9nsu",
  api_key: "842195339121929",
  api_secret: "5b6PzGomDFE4SQeQgbKB0fdeGog",
});

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, resp, next) => {
  try {
    const videoId = req.params.id;
    const updatingVideo = await Video.findById(videoId);
    if (!updatingVideo) return next(createError(404, "video not found"));

    if (req.user.id === updatingVideo.userId) {
      await Video.findByIdAndUpdate(videoId, { $set: req.body }, { new: true });
      resp.status(200).json("Updated!");
    } else {
      return next(createError(403, "Not authorised to update"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, resp, next) => {
  try {
    const videoId = req.params.id;
    const deletingVideo = await Video.findById(videoId);
    if (!deletingVideo) return next(createError(404, "video not found"));

    if (req.user.id === deletingVideo.userId) {
      await Video.findByIdAndDelete(videoId);
      resp.status(200).json("Updated!");
    } else {
      return next(createError(403, "Not authorised to delete"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, resp, next) => {
  try {
    const result = await Video.findById(req.params.id);
    if (!result) return next(createError(404, "Video Not Found!"));
    return resp.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, resp, next) => {
  try {
    if (!flag) {
      flag = 1;
      const videoId = req.params.id;
      const result = await Video.findById(videoId);
      if (!result) return next(createError(404, "Video Not Found!"));

      await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 },
      });
      flag = 0
      resp.status(200).json("+1 views");
    }
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, resp, next) => {
  try {
    const result1 = await Video.find().sort({ views: -1 });
    resp.status(200).json(result1);
  } catch (err) {
    next(err);
  }
};

export const random = async (req, resp, next) => {
  try {
    const result1 = await Video.aggregate([{ $sample: { size: 40 } }]);
    resp.status(200).json(result1);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, resp, next) => {
  try {
    const result1 = await User.findById(req.user.id);
    const subscribedYTer = result1.subscribedUsers;

    const list = await Promise.all(
      subscribedYTer.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );
    resp
      .status(200)
      .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const addLikeAndDislike = async (req, resp, next) => {
  try {
    const videoId = req.params.id;
    const userid = req.user.id;
    const video = await Video.findById(videoId);
    const listOfLikes = video.likes;
    const listOfDisikes = video.dislikes;

    let flag = 0,
      flag1 = 0;
    listOfLikes.map((user) => {
      if (user === userid) flag = 1;
    });

    listOfDisikes.map((user) => {
      if (user === userid) flag1 = 1;
    });

    if (!flag && flag1) {
      const video1 = await Video.findByIdAndUpdate(videoId, {
        $push: { likes: userid },
        $pull: { dislikes: userid },
      });
      resp.status(200).json("Liked!");
    } else if (flag && !flag1) {
      const video1 = await Video.findByIdAndUpdate(videoId, {
        $pull: { likes: userid },
        $push: { dislikes: userid },
      });
      resp.status(200).json("Disliked!");
    } else if (!flag && !flag1) {
      const video1 = await Video.findByIdAndUpdate(videoId, {
        $push: { likes: userid },
      });
      resp.status(200).json("Liked!");
    }
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, resp, next) => {
  const tags = req.query.tags.split(",");
  try {
    const video = await Video.find({ tags: { $in: tags } }).limit(20);
    resp.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, resp, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(20);
    resp.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

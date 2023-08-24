import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const Delete = async (req, resp, next) => {
  if (req.params.id === req.user.id) {
    try {
      const result = await User.findByIdAndDelete(req.user.id);
      resp.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only Your Account!"));
  }
};

export const getUser = async (req, resp, next) => {
  try {
    const user = await User.findById(req.params.id);
    resp.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, resp, next) => {
  try {
    const youtuber = req.params.id;
    const userId = req.user.id;
    const yt = await User.findById(userId)
    const listOfSubscriptions = yt.subscribedUsers
    let flag =0;

    listOfSubscriptions.map(item => {
      if(item == youtuber) flag = 1
    })

    if(!flag){
      const result = await User.findByIdAndUpdate(youtuber, {
        $inc: { subscribers: 1 },
      });
  
      const result1 = await User.findByIdAndUpdate(userId, {
        $push: { subscribedUsers: youtuber },
      });
  
      resp.status(200).json("Subscription done!");
    }else{
      const msg = createError(403, "Already subscribed")
      resp.json(msg)
    }
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, resp, next) => {
  try {
    const youtuber = req.params.id;
    const userId = req.user.id;

    const result = await User.findByIdAndUpdate(youtuber, {
      $inc: { subscribers: -1 },
    });

    const result1 = await User.findByIdAndUpdate(userId, {
      $pull: { subscribedUsers: youtuber },
    });

    resp.status(200).json("Unsubscription done!");
  } catch (err) {
    next(err);
  }
};

export const like = async(req, resp, next) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id

    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {likes: userId},
      $pull: {dislikes: userId}
    });

    resp.status(200).json("Video has been liked");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, resp, next) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const result = await Video.findByIdAndUpdate(videoId, {
      $addToSet: {dislikes: userId},
      $pull: {likes: userId}
    });
    resp.status(200).json("Video has been liked");
  } catch (err) {
    next(err);
  }
};

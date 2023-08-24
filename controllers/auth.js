import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import getDataUri from "../dataUri.js";

cloudinary.config({
  cloud_name: "dfzsw9nsu",
  api_key: "842195339121929",
  api_secret: "5b6PzGomDFE4SQeQgbKB0fdeGog",
});

export const signup = async (req, resp, next) => {
  try {
    const file = req.file;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    if (file) {
      const fileUri = getDataUri(file);
      // console.log(fileUri)
      const myCloud = cloudinary.uploader.upload(fileUri.content);
      // console.log(await myCloud);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        imgUrl: (await myCloud).url,
      });
      await newUser.save();
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      await newUser.save();
    }

    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    resp
      .cookie("access_token", token, {
        httpOnly: true
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(createError(500, "dublicate user"));
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true
      })
      .status(200)
      .json(others);

    //   console.log(req.cookies.access_token)
  } catch (err) {
    next(err);
  }
};

export const signinWithGoogle = async (req, resp, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      resp
        .cookie("access_token", token, {
          httpOnly: false,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = await User.create({
        ...req.body,
        fromGoogle: true,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT);
      resp
        .cookie("access_token", token, {
          httpOnly: true
        })
        .status(200)
        .json(newUser._doc);
    }
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, resp, next) => {
  try {
    resp.clearCookie("access_token");
    resp.send('Logged out successfully');
  } catch (err) {
    next(err);
  }
};

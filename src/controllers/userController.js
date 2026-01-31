import { User } from "../models/userModel.js";
import { validateUserSchema } from "../utils/joiSchemas.js";
import {
  bcryptPassword,
  comparePassword,
  generateToken,
} from "../utils/apiHelper.js";
import Profile from "../models/profileModel.js"; // your mongoose model
import cloudinary from "cloudinary";
import fs from "fs-extra";
import path from "path";

export const SignUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, isGoogleLogin } = req.body;
    if (!isGoogleLogin || !email) {
      if (!name || !email || !phoneNumber || !password) {
        return res.status(400).send("All fields are requiredd");
      }
    }

    if (!isGoogleLogin) {
      const { error } = validateUserSchema.validate(req.body);
      if (error) {
        return res.status(400).send({
          message: error.message,
          status: 400,
        });
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        message: "User ALready Exists",
        error: true,
        status: 406,
      });
    }

    const bcryptedPassword = await bcryptPassword(req.body.password);
    const newUser = new User(req.body);
    newUser.password = bcryptedPassword;
    if (isGoogleLogin) {
      newUser.isVerified = true;
    }

    await newUser.save();

    return res.send({
      message: "user created successfuly",
      user: newUser,
    });
  } catch (error) {
    return res.send({
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password, isGoogleLogin } = req.body;

    if (!isGoogleLogin) {
      if (!email || !password) {
        return res.status(400).send("All fields are required");
      }
    }

    const existUser = await User.findOne({ email });
    if (isGoogleLogin && !existUser) {
      const newUser = new User(req.body);
      newUser.isVerified = true;
      await newUser.save();
      const token = await generateToken(newUser.firstName, newUser.email,newUser?._id);

      return res.status(200).send({
        message: "User Loggin Successfuly",
        token,
      });
    }



    if (isGoogleLogin && existUser) {
      const token = await generateToken(existUser?.firstName, existUser?.email , existUser?._id);
      return res.status(200).send({
        message: "User Loggin Successfuly",
        token,
      });
    }

    if (!existUser) {
      return res.status(400).send({
        message: "User Not Found",
        status: 400,
      });
    }
    if (existUser) {
      const isValidPassword = await comparePassword(
        password,
        existUser.password,
      );
      if (isValidPassword) {
        const token = await generateToken(existUser.firstName, existUser.email , existUser?._id);

        return res.status(200).send({
          message: "User Loggin Successfuly",
          token,
        });
      } else {
        return res.status(401).send({
          message: "Wrong Password",
          status: 401,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

cloudinary.config({
  cloud_name: "dnzgzlxxy",
  api_key: "731957682875596",
  api_secret: "DqETxXSmCfkIwd23LBmfAaR-hhw",
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "Images/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

export const createProfile = async (req, res) => {
  try {
    const {
      name,
      company,
      qualification,
      certificate,
      address,
      experience,
      jobRole,
      phoneNumber,
    } = req.body;
    console.log("req.fileeee", req?.files);

    if (!name || !phoneNumber || !address) {
      return res.status(403).send({
        error: true,
        message: "Missing Required Fields",
      });
    }

    // 🔹 Update user basic info
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { name, phoneNumber },
      { new: true },
    );

    // 🔹 Handle Resume Upload
    let resumeUrl = null;
    let imageUrl = null;

    if (req.files?.resume?.length) {
      const resumeFile = req.files.resume[0];
      const originalName = path.parse(resumeFile.originalname).name;

      const uploadResult = await cloudinary.v2.uploader.upload(
        resumeFile.path,
        {
          resource_type: "raw",
          folder: "resumes",
          access_mode: "public", // 👈 THIS IS THE KEY
          public_id: originalName, // 👈 keeps file name
          use_filename: true,
          unique_filename: false,
        },
      );

      console.log("first------>", uploadResult);

      resumeUrl = uploadResult.url;

      // remove local file
      await fs.remove(resumeFile.path);
    }
    if (req.files?.image?.length) {
      const imageFile = req.files.image[0];
      const uploadResult = await cloudinary.v2.uploader.upload(imageFile.path);
      console.log("first------>", uploadResult);
      imageUrl = uploadResult.secure_url;
      await fs.remove(imageFile.path);
    }

    // 🔹 Create or Update Profile
    const profile = await Profile.findOneAndUpdate(
      { userId: user._id }, // unique per user
      {
        name,
        company,
        qualification,
        certificate,
        address,
        experience,
        jobRole,
        phoneNumber,
        email: user?.email,
        ...(resumeUrl && { resume: resumeUrl }),
        ...(imageUrl && { image: imageUrl }),
      },
      {
        new: true,
        upsert: true, // 🔥 create if not exists
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).send({
      error: false,
      message: "Profile created / updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ userId: req.user._id });
    console.log("testing--->", userProfile);
    return res.status(200).send({ error: false, data: userProfile });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    return res.status(200).send({ error: false, data: users });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

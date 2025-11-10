import { User } from "../models/userModel.js"
import { validateUserSchema } from '../utils/joiSchemas.js'
import { bcryptPassword, comparePassword, generateToken } from "../utils/apiHelper.js"
import Profile from "../models/profileModel.js"; // your mongoose model

export const SignUp = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, isGoogleLogin } = req.body
        if (!isGoogleLogin || !email) {

            if (!name || !email || !phoneNumber || !password) {
                return res.status(400).send("All fields are requiredd")
            }
        }


        if (!isGoogleLogin) {
            const { error } = validateUserSchema.validate(req.body)
            if (error) {
                return res.status(400).send({
                    message: error.message,
                    status: 400
                })
            }
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).send({
                message: "User ALready Exists",
                error: true,
                status: 406

            })
        }

        const bcryptedPassword = await bcryptPassword(req.body.password)
        const newUser = new User(req.body)
        newUser.password = bcryptedPassword
        if (isGoogleLogin) {
            newUser.isVerified = true
        }


        await newUser.save()




        return res.send({
            message: "user created successfuly",
            user: newUser
        })


    } catch (error) {
        return res.send({
            message: error.message
        })

    }
}



export const signIn = async (req, res) => {
    try {
        const { email, password, isGoogleLogin } = req.body

        if (!isGoogleLogin) {
            if (!email || !password) {
                return res.status(400).send("All fields are required")
            }

        }


        const existUser = await User.findOne({ email })
        console.log("existingUser" , existUser)
        if (isGoogleLogin && !existUser) {
            const newUser = new User(req.body)
            newUser.isVerified = true
            await newUser.save()
            const token = await generateToken(existUser.firstName, existUser.email)
            return res.status(200).send({
                message: "User Loggin Successfuly",
                token
            })
        }

        if (isGoogleLogin && existUser) {
            const token = await generateToken(existUser?.firstName, existUser?.email)
            return res.status(200).send({
                message: "User Loggin Successfuly",
                token
            })
        }

        if (!existUser) {
            return res.status(400).send({
                message: 'User Not Found',
                status: 400
            })
        }
        if (existUser) {
            const isValidPassword = await comparePassword(password, existUser.password);
            if (isValidPassword) {
                const token = await generateToken(existUser.firstName, existUser.email)

                return res.status(200).send({
                    message: "User Loggin Successfuly",
                    token
                })


            } else {
                return res.status(401).send({
                    message: "Wrong Password",
                    status: 401
                })
            }
        }




    } catch (error) {
        return res.status(500).send({
            message: error.message,
        })
    }
}

export const createProfile = async (req, res) => {
  try {
    const { jobTitle, experience } = req.body;

    // Validate required fields
    if (!jobTitle || !experience) {
      return res.status(400).json({ message: "Job title and experience are required" });
    }

    // Multer attaches files to req.files
    const image = req.files?.image ? req.files.image[0].path : null;
    const resume = req.files?.resume ? req.files.resume[0].path : null;

    // Create profile object
    const profile = new Profile({
      jobTitle,
      experience,
      image,
      resume,
    });

    // Save to DB
    await profile.save();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

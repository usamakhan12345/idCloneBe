import otpgenerate from 'otp-generator'
import { Otp } from '../models/otpModel.js'
import { sendOtpEmail } from '../utils/mailer.js'
import { User } from '../models/userModel.js'
import mongoose from 'mongoose'


export const generateOtp = async (req, res) => {
    try {
        const user = req.user
        const userId = new mongoose.Types.ObjectId(user._id);
        console.log("userrr---->", userId)
        await Otp.deleteMany({ userId })
        const otp = otpgenerate.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
        const generateOtp = new Otp({
            userId: user._id.toString(),
            otpCode: otp,
            expiredAt: new Date(Date.now() + 10 * 60 * 1000)
        })
        const emailSent = await sendOtpEmail(user?.email, otp)
        await generateOtp.save()

        return res.status(200).send({ message: "All done", otp })

    } catch (error) {
        return res.status(500).send({ message: error.message })

    }

}


export const verifyOtp = async (req, res) => {
    try {
        const { otpCode } = req.body
        const user = req.user
        const otp = await Otp.find({ userId: user._id.toString() })
        console.log("testOtp----->", otp[0].otpCode, otpCode)
        if (otp[0]?.otpCode === otpCode) {
            await User.findByIdAndUpdate(user._id ,{ isVerified: true })
            await Otp.findByIdAndDelete(otp[0]._id)
            res.status(200).send({ message: 'User Verified' })
        } else {
            res.status(401).send({ message: 'Invalid Otp or Otp May be Expired' })

        }
        console.log("otp----------->", otp)
        return res.status(200).send({ message: "All done", otp })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }

}



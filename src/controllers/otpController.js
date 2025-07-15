import otpgenerate from 'otp-generator'
import { Otp } from '../models/otpModel.js'
import { sendOtpEmail } from '../utils/mailer.js'
import { User } from '../models/userModel.js'


export const generateOtp = async (req, res) => {
    try {
        const {email} = req.body
        await Otp.deleteMany({ email })
        const otp = otpgenerate.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
        const generateOtp = new Otp({
            email,
            otpCode: otp,
            expiredAt: new Date(Date.now() + 10 * 60 * 1000)
        })
         await sendOtpEmail(email, otp)
        await generateOtp.save()

        return res.status(200).send({ message: "All done", otp })

    } catch (error) {
        return res.status(500).send({ message: error.message })

    }

}


export const verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body
        const otp = await Otp.findOne({email})
        const user =await User.findOne({email})
        if(!user){
            return res.status(400).send({message:"User not found"})
        }
        if (otp?.otpCode === otpCode) {

            await User.findByIdAndUpdate( user._id.toString() ,{ isVerified: true })
            await Otp.findByIdAndDelete(otp._id)
            res.status(200).send({ message: 'User Verified' })
        } else {
            res.status(401).send({ message: 'Invalid Otp or Otp May be Expired' })

        }
        return res.status(200).send({ message: "All done", otp })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }

}



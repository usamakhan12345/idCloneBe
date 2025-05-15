import joi from 'joi'




export const validateUserSchema = joi.object({
    firstName:joi.string().max(20).required(),
    lastName:joi.string().max(20).required(),
    email:joi.string().email().required(),
    phoneNumber:joi.string().pattern(/^[0-9]{11}$/).required(),
    password: joi.string().required()
})


export const validateJobScehma = joi.object({
    jobTitle:joi.string().max(20).required(),
    location:joi.string().max(20).required(),
    salaryRange:joi.string().required(),
    jobDescription:joi.string().required(),
    jobType: joi.string().required(),
    email:joi.string().email().required(),

})
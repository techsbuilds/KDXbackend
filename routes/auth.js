import express from 'express'
import { sendOtp, sendOtpForSignUp, verifyOtp, verifySignUpUser } from '../controller/authController.js'

const app = express.Router()


//Send otp for login 
app.post('/sendotp',sendOtp)


//Verify otp for login
app.post('/verifyotp',verifyOtp)


//Send otp for signup
app.post('/sendotp/signup',sendOtpForSignUp)

//Verify Otp for signup user
app.post('/verifyotp/signup',verifySignUpUser)



export default app
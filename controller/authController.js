import USER from "../models/USER.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import twilio from 'twilio'
import OTP from "../models/OTP.js";

dotenv.config()

const accountSiD=process.env.ACCOUNT_SID
const authToken=process.env.AUTH_TOKEN

const client = new twilio(accountSiD, authToken);

//For generate otp
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

//For send otp for login
export const sendOtp = async (req, res, next) =>{
    try{
        const {mobileno} = req.body

        if(!mobileno) return res.status(400).json({message:"Please provide mobile number",status:400})

        const existuser = await USER.findOne({mobileno})
        
        if(!existuser) return res.status(404).json({message:"User not found.",status:404})

        const otp = generateOTP()

        // const message = await client.messages.create({
        //     body: `Your verification code is: ${otp}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: mobileno
        // });

        let newOtp = new OTP({
            mobileno,
            otp
        })

        await newOtp.save()

        let response = {
            otp,
            // sid:message.sid
        }

        return res.status(200).json({message:"Otp sended successfully",data:response,status:200})

    }catch(err){
        next(err)
    }
}


//For verify otp for login
export const verifyOtp = async (req, res, next) =>{
    const {mobileno , otp} = req.body

    if(!mobileno || !otp) return res.status(400).json({message:"Please provide otp and mobileno",status:400})

    try{
       const user = await USER.findOne({mobileno})
       
       if(!user) return res.status(404).json({message:"User not found.",status:404})
       
       const dbotp = await OTP.findOne({mobileno})

       if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

       if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

       await OTP.findOneAndDelete({mobileno})

       const token = jwt.sign({mongoid:user._id}, process.env.JWT,{
        expiresIn: "365d", // Lifetime token (1 year)
       })

       return res.status(200).json({message:"Otp verified and Login successfully.",data:{token,userId:user._id},status:200})

    }catch(err){
        next(err)
    }
}

//Send otp for signup user
export const sendOtpForSignUp = async (req, res, next) =>{
    try{
       const { mobileno, email } = req.body

       if(!mobileno || !email) return res.status(400).json({message:"Please provide mobile number.",status:400})

       //Check mobile no
       const checkMobileno = await USER.findOne({mobileno})

       if(checkMobileno) return res.status(409).json({message:"User is already exist with same mobileno."})

       //Check email address
       const checkEmail = await USER.findOne({email})

       if(checkEmail) return res.status(409).json({message:"User is already exist with same email address."})

       const otp = generateOTP()

    //    const message = await client.messages.create({
    //        body: `Your verification code is: ${otp}`,
    //        from: process.env.TWILIO_PHONE_NUMBER,
    //        to: mobileno
    //    });

       let newOtp = new OTP({
           mobileno,
           otp
       })

       await newOtp.save()

       let response = {
           otp,
        //    sid:message.sid
       }

       return res.status(200).json({message:"Otp sended successfully",data:response,status:200})

    }catch(err){
        next(err)
    }
}

//Verify Otp for Signup User
export const verifySignUpUser = async (req, res, next) =>{
    try{
        const {name, mobileno, email, company, address, gstno, otp} = req.body

        if(!name || !mobileno || !email || !company || !address || !otp) return res.status(400).json({message:"Please provide all required fields.",status:400})

        const dbotp = await OTP.findOne({mobileno})

        console.log(dbotp)

        if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

        if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

        await OTP.findOneAndDelete({mobileno})

        const newUser = new USER({
            name,
            mobileno,
            email,
            company,
            address,
            gstno:gstno || null
        })

        await newUser.save()

        const token = jwt.sign({mongoid:newUser._id}, process.env.JWT,{
            expiresIn: "365d", // Lifetime token (1 year)
           })
    
        return res.status(200).json({message:"Otp verified and Registered successfully.",data:{token,userId:newUser._id},status:200})

    }catch(err){
        next(err)
    }
}
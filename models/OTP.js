import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobileno:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now, expires: 90 } 
},{timestamps:true})

export default mongoose.model("Otp",otpSchema)
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    total_amount:{
        type:String,
        required:true
    },
    paid_amount:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    invoice:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Invoice'
    }
},{timestamps:true})

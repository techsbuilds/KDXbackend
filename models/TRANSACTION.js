import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    invoice:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Invoice',
        required:true
    },
    paid_amount:{
        type:Number,
        required:true
    },
    discount_amount:{
        type:Number,
        required:true
    },
    added_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true})


export default mongoose.model('Transaction',transactionSchema)
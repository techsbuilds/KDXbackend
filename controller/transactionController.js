import INVOICE from "../models/INVOICE.js";
import TRANSACTION from "../models/TRANSACTION.js";
import USER from '../models/USER.js'

export const createTransaction = async (req, res, next)=>{
    try{

        const {mongoid} = req

        if(!mongoid) return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });

        const user = await USER.findById(mongoid)

        if(!user) return res.status(404).json({message:"User not found.",status:404})

        const {invoice,paid_amount,discount_amount} = req.body

        if(!invoice || !paid_amount || !discount_amount){
            return res.status(400).json({message:"Please give all required fields.",status:400})
        }

        const existInvoice = await INVOICE.findById(invoice)

        let total_amount = paid_amount + discount_amount

        if(total_amount > existInvoice.total_amount || total_amount > existInvoice.pending_amount){
            return res.status(400).json({message:"Total of paid and discount is greter then pending amount.",status:400})
        }

        await INVOICE.findByIdAndUpdate(invoice,{$set:{payment_status:"Outstanding",pending_amount:existInvoice.pending_amount-total_amount}})

        if(!existInvoice) return res.status(404).json({message:"Invoice is already exist.",status:404})

        const newTransaction = new TRANSACTION({
            invoice,
            paid_amount,
            discount_amount,
            added_by:mongoid
        })

        await newTransaction.save()

        return res.status(200).json({message:"New transaction created",status:200,data:newTransaction})

    }catch(err){
        next(err)
    }
}


import INVOICE from "../models/INVOICE.js";
import TRANSACTION from "../models/TRANSACTION.js";
import USER from '../models/USER.js'
import mongoose from "mongoose";

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

        const existInvoice = await INVOICE.findOne({_id:invoice,added_by:mongoid})

        if(!existInvoice) return res.status(404).json({message:"Invoice is not found.",status:404})

        let total_amount = paid_amount + discount_amount

        if(total_amount > existInvoice.total_amount || total_amount > existInvoice.pending_amount){
            return res.status(400).json({message:"Total of paid and discount is greater then pending amount.",status:400})
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

export const getTransaction = async (req, res, next) =>{
    try {
        const { mongoid } = req;
    
        if (!mongoid)
          return res.status(400).json({
            message: "Unauthorized request: Missing user ID.",
            status: 400,
          });
    
        const user = await USER.findById(mongoid);
        if (!user)
          return res
            .status(404)
            .json({ message: "User not found.", status: 404 });
    
        const { vehicleno, mobileno, from, to } = req.query;

        console.log(from)
        console.log(to)
    
        const pipeline = [
          {
            $match: { added_by: new mongoose.Types.ObjectId(mongoid) }
          },
          {
            $lookup: {
              from: "invoices",
              localField: "invoice",
              foreignField: "_id",
              as: "invoice"
            }
          },
          { $unwind: "$invoice" },
          {
            $lookup: {
              from: "customers",
              localField: "invoice.customer",
              foreignField: "_id",
              as: "customer"
            }
          },
          { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } }
        ];
    
        // Filter: Vehicle Number
        if (vehicleno) {
          pipeline.push({
            $match: {
              "customer.customer_vehicle_number": {
                $regex: vehicleno.replace(/\s+/g, "\\s*"),
                $options: "i"
              }
            }
          });
        }
    
        // Filter: Mobile Number
        if (mobileno) {
          pipeline.push({
            $match: {
              "customer.customer_mobile_no": mobileno
            }
          });
        }
    
        // Filter: Date Range
        if (from || to) {
          const dateFilter = {};
          if (from) {
            dateFilter.$gte = new Date(from);
          }
          if (to) {
            const endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);
            dateFilter.$lte = endDate;
          }
          pipeline.push({
            $match: {
              createdAt: dateFilter
            }
          });
        }

    
        // Optional: Project final result (select only needed fields)
        pipeline.push({
          $project: {
            paid_amount: 1,
            discount_amount: 1,
            createdAt: 1,
            "invoice.invoice_id": 1,
            "customer.customer_name": 1,
            "customer.customer_mobile_no": 1,
            "customer.customer_vehicle_number": 1
          }
        });
    
        const transactions = await TRANSACTION.aggregate(pipeline);
    
        return res
          .status(200)
          .json({
            message: "All transactions retrieved.",
            data: transactions,
            status: 200,
          });
    
      } catch (err) {
        next(err);
      }
}
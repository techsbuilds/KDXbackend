import CUSTOMER from "../models/CUSTOMER.js";
import INVOICE from "../models/INVOICE.js";
import mongoose from "mongoose";

export const createInvoice = async (req, res, next)=>{
    try{
        const {mongoid} = req

        if(!mongoid) return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });

        const {invoice_id,billing_description,total_amount,customer_name,customer_mobile_no,customer_vehicle_number,customer_vehicle_name,customer_vehicle_km} = req.body
        if(!invoice_id || !billing_description || !total_amount || !customer_name || !customer_mobile_no || !customer_vehicle_number || !customer_vehicle_name || !customer_vehicle_km) return res.status(400).json({message:"Please provode all required fields.",status:400})

        if(total_amount<=0){
            return res.status(400).json({ message: "Total amount must be a valid positive number.", status: 400 });
        }
 
        const invoice = await INVOICE.findOne({invoice_id})

        if(invoice) return res.status(409).json({ message: "Invoice is already exist with invoice id.", status: 409})

        let existCustomer = await CUSTOMER.findOne({$or:[{customer_mobile_no},{customer_vehicle_number}]})

        console.log(existCustomer)

        if(!existCustomer){
           existCustomer = new CUSTOMER({
             customer_name,
             customer_mobile_no,
             customer_vehicle_km,
             customer_vehicle_name,
             customer_vehicle_number
           })

           await existCustomer.save()
        }
        
        const newInvoice = new INVOICE({
            invoice_id,
            billing_description,
            total_amount,
            pending_amount:total_amount,
            customer:existCustomer._id,
            added_by:mongoid
        })

        await newInvoice.save()

        await newInvoice.populate('customer');

        return res.status(200).json({message:"New invoice created successfully.",data:newInvoice,status:200})

    }catch(err){
        next(err)
    }
}

export const getInvoice = async (req, res, next) => {
  try {
    const { mongoid } = req; // Authenticated user ID
    if (!mongoid) {
      return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });
    }

    const { contactno, vehicleno, from, to } = req.query;

    const pipeline = [
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

      {
        $match: {
          added_by: new mongoose.Types.ObjectId(mongoid)
        }
      }
    ];

    // Optional filter: Contact number
    if (contactno) {
      pipeline.push({
        $match: {
          "customer.customer_mobile_no": {
            $regex: contactno,
            $options: "i" // Optional, useful if numbers have characters like +91
          }
        }
      });
    }

    // Optional filter: Vehicle number (case-insensitive, flexible spacing)
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

    // Optional filter: Date range
    if (from || to) {
      const dateFilter = {};
      if (from) {
        dateFilter.$gte = new Date(from);
      }
      if (to) {
        // Add 1 day to make the `to` inclusive (end of day)
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        dateFilter.$lte = endDate;
      }

      pipeline.push({
        $match: { createdAt: dateFilter }
      });
    }

    // Final projection
    pipeline.push({
      $project: {
        invoice_id: 1,
        total_amount: 1,
        pending_amount: 1,
        payment_status: 1,
        billing_description: 1,
        added_by: 1,
        "customer.customer_name": 1,
        "customer.customer_mobile_no": 1,
        "customer.customer_vehicle_number": 1,
        "customer.customer_vehicle_name": 1,
        "customer.customer_vehicle_km": 1,
        createdAt: 1
      }
    });

    const invoices = await INVOICE.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ status: 200, message: "Invoices fetched successfully.", data: invoices });

  } catch (err) {
    next(err);
  }
};


export const getOneInvoice = async (req, res, next) =>{
  try{
  
    const { mongoid } = req; // Authenticated user ID

    if (!mongoid) {
      return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });
    }

    const {invoiceId} = req.params

    if(!invoiceId) return res.status(400).json({message:"Please provide invoice id.",status:400})

    const invoice = await INVOICE.findOne({_id:invoiceId,added_by:mongoid}).
    populate('customer').
    populate('added_by')

    return res.status(200).json({message:"Invoice retrived successfully",data:invoice,status:200})

  }catch(err){
    next(err)
  }
}
import mongoose from "mongoose"; 
import CUSTOMER from "../models/CUSTOMER.js";
import INVOICE from "../models/INVOICE.js";

export const createInvoice = async (req, res, next)=>{
    try{
        const {mongoid} = req

        if(!mongoid) return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });

        const {invoice_id,billing_description,total_amount,customer_name,customer_mobile_no,customer_vehicle_number,customer_vehicle_name,customer_vehicle_km} = req.body
        if(!invoice_id || !billing_description || !total_amount || !customer_name || !customer_mobile_no || !customer_vehicle_number || !customer_vehicle_name || !customer_vehicle_km) return res.status(400).json({message:"Please provode all required fields.",status:400})
 
        const invoice = await INVOICE.findOne({invoice_id})

        if(invoice) return res.status(409).json({ message: "Invoice is already exist with invoice id.", status: 409})

        let existCustomer = await CUSTOMER.findOne({customer_mobile_no})

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

        return res.status(200).json({message:"New invoice created successfully.",data:newInvoice,status:200})

    }catch(err){
        next(err)
    }
}
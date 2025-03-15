import mongoose from "mongoose";

export const invoiceSchema = new mongoose.Schema({
  invoice_id: {
    type: String,
    required: true
  },
  billing_description: [{
    name: { type: String, required: true },
    qty: { type: String, required: true },
    rate: { type: String, required: true },
    amount: { type: String, required: true }
  }],
  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Customer'
  },
  total_amount: {
    type: String,
    required: true
  },
  pending_amount: {
    type: String,
    required:true
  },
  payment_status: {
    type:Boolean,
    default:false
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);

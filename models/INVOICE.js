import mongoose from "mongoose";

export const invoiceSchema = new mongoose.Schema({
  invoice_id: {
    type: String,
    required: true
  },
  billing_description: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Customer'
  },
  total_amount: {
    type: Number,
    required: true
  },
  pending_amount: {
    type: Number,
    required:true
  },
  payment_status: {
    type: String,
    default:"Pending"
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);

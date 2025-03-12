import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
      customer_name: {
        type: String,
        required: true
      },
      customer_mobile_no: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
        unique: true,
        match: [/^\+\d{1,3}\d{10}$/, "Mobile number must start with a country code (e.g., +91) followed by 10 digits"]
      },
      customer_vehicle_number: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/, "Vehicle number must be in format: 'GJ 21 CB 0146'"]
      },
      customer_vehicle_name: {
        type: String,
        required: true
      },
      customer_vehicle_km: {
        type: String,
        required: true
      }
})


export default mongoose.model('Customer',customerSchema)
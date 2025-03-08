import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    profile_picture:{
        fileName:String,
        fileType:String,
        fileSize:String,
        filePath:String
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    mobileno: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
        unique: true,
        match: [/^\+\d{1,3}\d{10}$/, "Mobile number must start with country code (e.g., +91) followed by 10 digits"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters"]
    },
    gstno: {
        type: String,
        trim: true,
        unique: true,
        match: [/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, "Invalid GST number format"]
    },
    status:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

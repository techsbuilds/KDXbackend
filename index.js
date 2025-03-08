import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'


// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory's path
const __dirname = path.dirname(__filename);

dotenv.config();

// App configuration
const port = process.env.PORT || 8080;



const app = express();

// Serve static files from the uploads directory
// app.use(
//   "/uploads/partner/logo",
//   express.static(path.join(__dirname, "uploads/partner/logo"))
// );


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
    ];
    // Allow requests with no origin (like mobile apps or CURL)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  credentials: true,
};

app.options("*", cors(corsOptions)); // Allow OPTIONS for all routes

// Middleware for using CORS
app.use(cors(corsOptions));
app.use(helmet()); // Protects headers
app.use(compression()); // Compresses response payloads

// Middleware to parse JSON
app.use(express.json({limit:"50mb"}));

// Middleware to read cookies data
app.use(cookieParser());
app.use(express.urlencoded({limit:"50mb", extended: true }));

// Global rate limiter (limits requests per IP)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Send rate limit headers
  });
  app.use(globalLimiter);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    throw err;
  }
};

app.get("/", (req, res) => {
  res.send("Bahut maza aa raha hai 🥳");
});


// Notify MongoDB connection status
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Middleware
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)


// Middleware to catch errors
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || "Something went wrong!";

  return res.status(errStatus).json({
    success: "false",
    status: errStatus,
    message: errMsg,
    stack: err.stack,
  });
});

app.listen(port, () => {
  connectDb();
  console.log(`App is listening on port: ${port}`);
});
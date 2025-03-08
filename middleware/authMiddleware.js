import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = async ()=>{
    const token = req.header("Authorization");

    if (!token) {
       return res.status(401).json({ message: "Access denied. No token provided." ,status:401});
    }

    try{
       const decoded = jwt.verify(token,process.env.JWT)

       req.mongoid = decoded.mongoid
       req.userType = decoded.userType
       next()
    }catch(err){
       return res.status(400).json({message:"Invalid token",status:400})
    }
}
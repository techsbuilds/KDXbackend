import USER from "../models/USER.js";
import fs from 'fs'

//Remove exist file 
const removeProfilePic = (pathname) =>{
   if(pathname && fs.existsSync(pathname)){
    if(fs.existsSync(pathname)){
        fs.unlinkSync(pathname)
    }
   }
}


//For create new user
export const createUser = async (req,res,next) =>{
    try{
       const {name, mobileno, email, company, address, gstno} = req.body
       let profile_picture = null
       if(req.file){
         profile_picture = {
           fileName:req.file.filename,
           fileType:req.file.mimetype,
           fileSize:req.file.size,
           filePath:req.file.path
         }
       }

       if(!name || !mobileno || !email || !company || !address){
         removeProfilePic(req?.file?.path)
         return res.status(400).json({message:"Please provide all required fields.",status:400})
       } 

       const checkMail = await USER.findOne({email})

       if(checkMail){
        removeProfilePic(req?.file?.path)
        return res.status(409).json({message:"User is already exist with same email address.",status:409})
       }

       const checkMobileno = await USER.findOne({mobileno})

       if(checkMobileno){
        removeProfilePic(req?.file?.path)
        return res.status(409).json({message:"User is already exist with same mobile number.",status:409})
       } 

       const newUser = new USER({
        profile_picture:profile_picture,
        name,
        mobileno,
        email,
        company,
        address,
        gstno:gstno || null
       })

       await newUser.save()

       return res.status(200).json({message:"New user created successfully",data:newUser,status:200})

    }catch(err){
        next(err)
    }
}

//For update user 
export const updateUser = async (req, res, next) =>{
    try{
       if(!req.mongoid){
            removeProfilePic(req?.file?.path)
            return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });
       }

       const user = await USER.findById(req.mongoid)

       if(!user){
        removeProfilePic(req?.file?.path)
        return res.status(404).json({message:"User not found.",status:404})
       }

       let updatedData = {...req.body}

       if(updatedData.mobileno!==user.mobileno){
         const existUser = await USER.findOne({mobileno:updatedData.mobileno})

         if(existUser){
            removeProfilePic(req?.file?.path)
            return res.status(409).json({message:"User is already exist with same mobileno.",status:409})
         }
       }

       if(updatedData.email !== user.email){
        const existUser = await USER.findOne({mobileno:updatedData.email})

        if(existUser){
            removeProfilePic(req?.file?.path)
            return res.status(409).json({message:"User is already exist with same email address",status:409})
        }
       }

       if(req.file){
        if(user.profile_picture.filePath){
            if(fs.existsSync(user.profile_picture.filePath)){
                fs.unlinkSync(user.profile_picture.filePath)
            }else{
                removeProfilePic(req?.file?.path)
                return res.status(404).json({message:"File not found.",status:404})
            }
         }

         updatedData.profile_picture = {
            fileName:req.file.filename,
            fileSize:req.file.size,
            filePath:req.file.path,
            fileType:req.file.mimetype
         }
       }

       const updatedUser = await USER.findByIdAndUpdate(req.mongoid,updatedData,{new:true,runValidators:true})

       return res.status(200).json({message:"User updated successfully",status:200,data:updatedUser})

    }catch(err){
        next(err)
    }
}

//For get one user 
export const getOneUser = async (req, res, next) =>{
    try{
        if(!req.mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID.", status: 400 });
        }

        const user = await USER.findById(req.mongoid)

        if(!user) return res.status(404).json({message:"User not found.",status:404})

        return res.status(200).json({message:"User retrived.",data:user,status:200})

    }catch(err){
        next(err)
    }
}
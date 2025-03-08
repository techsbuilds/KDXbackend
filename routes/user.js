import express from 'express'
import { createUser, getOneUser, updateUser } from '../controller/userController.js'
import upload from '../middleware/multer.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const app = express.Router()

//For create new user
app.post('/',upload.single('user'),createUser)

//For update user 
app.put('/',verifyToken,upload.single('user'),updateUser)

//For get user
app.get('/',verifyToken,getOneUser)


export default app
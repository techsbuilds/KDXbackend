import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { sendMessage } from '../controller/messageController.js'


const app = express.Router()


//For send message
app.post('/',verifyToken,sendMessage)


export default app
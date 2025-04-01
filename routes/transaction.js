import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { createTransaction } from '../controller/transactionController.js'


const app = express.Router()

//For create new transaction
app.post('/',verifyToken, createTransaction)


export default app
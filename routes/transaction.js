import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { createTransaction, getTransaction } from '../controller/transactionController.js'


const app = express.Router()

//For create new transaction
app.post('/',verifyToken, createTransaction)

//For get transaction
app.get('/',verifyToken, getTransaction)

export default app
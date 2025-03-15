import express from 'express'
import { createInvoice } from '../controller/invoiceController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const app = express.Router()


//For create new invoice
app.post('/',verifyToken,createInvoice)



export default app



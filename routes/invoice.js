import express from 'express'
import { createInvoice, getInvoice } from '../controller/invoiceController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const app = express.Router()


//For create new invoice
app.post('/',verifyToken,createInvoice)

//For get invoice
app.get('/',verifyToken,getInvoice)



export default app



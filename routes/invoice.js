import express from 'express'
import { createInvoice, getInovice } from '../controller/invoiceController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const app = express.Router()


//For create new invoice
app.post('/',verifyToken,createInvoice)

//For get invoice
app.get('/',verifyToken,getInovice)



export default app



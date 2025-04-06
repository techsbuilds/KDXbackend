import express from 'express'
import { createInvoice, getInvoice, getOneInvoice } from '../controller/invoiceController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const app = express.Router()


//For create new invoice
app.post('/',verifyToken,createInvoice)

//For get invoice
app.get('/',verifyToken,getInvoice)


//For get one invoice 
app.get('/getone/:invoiceId',verifyToken,getOneInvoice)


export default app



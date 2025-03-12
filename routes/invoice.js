import express from 'express'
import { createInvoice } from '../controller/invoiceController'

const app = express.Router()


//For create new invoice
app.post('/',createInvoice)



export default app



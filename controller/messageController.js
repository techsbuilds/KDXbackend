import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const fromWhatsappNumber = 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

export const sendMessage = async (req, res, next) =>{
    try{
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
          return res.status(400).json({ error: 'phoneNumber and message are required' });
        }
      
        
          const msg = await client.messages.create({
            from: fromWhatsappNumber,
            to: `whatsapp:${phoneNumber}`, // Ensure it includes country code
            body: message,
            // mediaUrl: pdfUrl ? [pdfUrl] : undefined, // Optional media attachment
          });
      
          res.status(200).json({ success: true, sid: msg.sid });
        
    }catch(err){
        next(err)
    }
}
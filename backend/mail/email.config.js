import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {SESClient} from "@aws-sdk/client-ses";


dotenv.config();

export const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});



export const senderEmail = process.env.GMAIL_SENDER;
export const sender = {
    
    user: senderEmail, // your Gmail address
    pass: process.env.GMAIL_APP_PASS, // your Gmail App Password
  
}


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: sender,
});



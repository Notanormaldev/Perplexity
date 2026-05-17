// import nodemailer from 'nodemailer'

// const trasnpoter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//    family: 4, 
//     auth:{
//         // type:'OAuth2',
//         // user: process.env.GOOGLE_USER,
//         // clientId: process.env.GOOGLE_CLIENT_ID,
//         // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     user: process.env.EMAIL,
//     pass: process.env.APP_PASSWORD,
//     }
// })


// trasnpoter.verify((error,sucess)=>{
//      if (error) {
//     console.error('Error connecting to email server:', error);
//   }
//    else {
//     console.log('Email server is ready to send messages');
//   }
// });

// export async function sendEmail({to,html,subject,text}){
//     const mailoptions={
//         // from:process.env.GOOGLE_USER,
//         from:process.env.EMAIL,
//         to,
//         subject,
//         html,
//         text
//     }

//     const dts=await trasnpoter.sendMail(mailoptions);
//     // console.log('email sent',dts);
    
// }
const client = new Brevo.TransactionalEmailsApi();
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";

const client = new TransactionalEmailsApi();
client.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);


client.getAccount()
  .then(() => console.log("Email server is ready to send messages"))
  .catch((error) => console.error("Error connecting to email server:", error));

export async function sendEmail({ to, html, subject, text }) {
  const mailOptions = new SendSmtpEmail();
  
  mailOptions.sender = { email: process.env.EMAIL };
  mailOptions.to = [{ email: to }];
  mailOptions.subject = subject;
  mailOptions.htmlContent = html;
  mailOptions.textContent = text;

  const dts = await client.sendTransacEmail(mailOptions);
  return dts;
}
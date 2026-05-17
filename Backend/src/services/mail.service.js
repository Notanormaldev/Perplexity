import nodemailer from 'nodemailer'

const trasnpoter = nodemailer.createTransport({
      host: "smtp.gmail.com",
  port: 587,
  secure: true,
   family: 4, 
    auth:{
        // type:'OAuth2',
        // user: process.env.GOOGLE_USER,
        // clientId: process.env.GOOGLE_CLIENT_ID,
        // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
    }
})


trasnpoter.verify((error,sucess)=>{
     if (error) {
    console.error('Error connecting to email server:', error);
  }
   else {
    console.log('Email server is ready to send messages');
  }
});

export async function sendEmail({to,html,subject,text}){
    const mailoptions={
        // from:process.env.GOOGLE_USER,
        from:process.env.EMAIL,
        to,
        subject,
        html,
        text
    }

    const dts=await trasnpoter.sendMail(mailoptions);
    // console.log('email sent',dts);
    
}

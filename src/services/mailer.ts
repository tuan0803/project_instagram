
const nodemailer = require('nodemailer');
require('dotenv').config();  

const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',  
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.API_KEY,  
    pass: process.env.SECRET_KEY, 
  },
});

const sendEmailActive = (to: string, subject: string, htmlContent: string) => {
  const mailOptions = {
    from: process.env.EMAIL, 
    to: to, 
    subject: subject, 
    html: htmlContent, 
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

export default sendEmailActive;

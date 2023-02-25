const nodemailer = require("nodemailer");
const { google } = require('googleapis');


const sendMail=async(email,url)=>{
    try{
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
          
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
    
        const mailOptions={
            from:"bahubali",
            to:email,
            subject: 'verify email',
            text: url,
        };

        const result = await transporter.sendMail(mailOptions);
        return "email sent";
    
    }catch(err){
        console.log(err);
        return err;
    }


}

module.exports=sendMail;




// const nodemailer = require("nodemailer");
// const { google } = require('googleapis');

// // Replace these values with your own client ID and client secret
// const CLIENT_ID = 'your_client_id';
// const CLIENT_SECRET = 'your_client_secret';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// const REFRESH_TOKEN = 'your_refresh_token';

// // Define the message options for the email
// const messageOptions = {
//   from: 'your_email_address',
//   to: 'recipient_email_address',
//   subject: 'Test email from Node.js',
//   text: 'Hello from Node.js!'
// };

// // Define the transporter object using the Gmail SMTP server
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     type: 'OAuth2',
//     user: 'your_email_address',
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESH_TOKEN,
//     accessToken: oAuth2Client.getAccessToken()
//   }
// });

// // Send the email
// transporter.sendMail(messageOptions, (error, info) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });

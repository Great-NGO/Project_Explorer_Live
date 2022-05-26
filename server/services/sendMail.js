// require('dotenv').config();
const nodemailer = require("nodemailer");
const { getUrl } = require("./user");
const { google } = require('googleapis');


//Getting parameters from our environment variables and saving them to a new variable
const nodeMailerEmail = process.env.NODEMAILER_USER_EMAIL;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log(nodeMailerEmail);
console.log(REDIRECT_URI);

//Using the google api package to help with oAuth authentication  and to retrieve access token
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// google.options({ auth: oAuth2Client }); // Apply the settings globally 

const sendResetPwdMail = async (email, firstname, id) => {

    // try {
    const accessToken = await oAuth2Client.getAccessToken()

    console.log("pppp");
    console.log(accessToken);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: nodeMailerEmail,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
       
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let mail = {
        from: "Great-NGO Project-Explorer ",
        to: email,
        subject: "Reset your Project Explorer password",
        html: `
           Hi <strong>${firstname}</strong>,
           <p>Having an issue with remembering your password? Well don't worry! </p>
           <p>Click the link below to complete your password reset process </p>
           <br> <a href="${getUrl()}/resetPassword/${id}">Click here to reset your password</a>
        `
    }

    // const result = await transporter.sendMail(mail)
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("info.messageId: " + info.messageId);
            console.log("info.envelope: ", info.envelope);
            console.log("info.accepted: ", info.accepted);
            console.log("info.rejected: ", info.rejected);
            console.log("info.pending: " + info.pending);
            console.log("info.response: " + info.response);

        }
        transporter.close();
    })
    //     return result;

    // } catch (error) {
    //     console.log(error)
    //     return error;
    // }

}

const sendWelcomeMail = async (email, firstname) => {

    const accessToken = await oAuth2Client.getAccessToken()
    console.log(accessToken);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: nodeMailerEmail,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
       
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let mail = {
        from: "Great-NGO Project-Explorer ",
        to: email,
        subject: "Welcome to NGO-TECH Project Explorer",
        html: `
           Hi <strong>${firstname}</strong>,
           <p>Thank you so much for checking out and signing up on my project explorer application. </p>
           <p> Outlined below are features of my application at the moment. Expect more to come in the nearest future:  </p>
           <ul>
                <span> 1. Complete User management system - </span>
                    <li>  You can upload your profile picture or continue with the default one  </li>
                    <li>  You can update your user profile (matric number, password, email, name etc.)  </li>
                    <li>  You can login/signup with social platforms like google and facebook (as you probably already did)  </li>
                    <li> If you ever forget your password, you can request to reset your password and an email containing a reset link will be sent to you.</li>
                
                <span> 2. Complete Commenting system - </span>
                    <li> The goal of this application is to allow students learn, explore, connect and communicate with one another</li>
                    <li> You can view recent projects found on the home page and interact with the project owners by posting your comments and much more.</li>
                    <li> Every verified user of this application has custom notifications  </li>

                <span> Finally - </span>
                    <li> This application was built and inspired by reason of the training i received from Edconnect - Edconnect NG. I would definitely recommend joining them for their next cohort(If you are interested)  </li>
                    <li> Expect more updates to this application in the nearest future. My aim is to make the app a lot more powerful and substantial than it currently is by adding more helpful features </li>
                    <li> UNTIL THEN FEEL FREE TO REACH ME ON MY DEVELOPER EMAIL @ ngotechdev@gmail.com about any suggestions, ideas or feedback you may have!  </li>
           </ul>
           <h3> Have a wonderful day! </h3>
        `
    }

    // const result = await transporter.sendMail(mail)
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("info.messageId: " + info.messageId);
            console.log("info.envelope: ", info.envelope);
            console.log("info.accepted: ", info.accepted);
            console.log("info.rejected: ", info.rejected);
            console.log("info.pending: " + info.pending);
            console.log("info.response: " + info.response);

        }
        transporter.close();
    })
    
}

module.exports = { sendResetPwdMail, sendWelcomeMail }
// require('dotenv').config();
const nodemailer = require("nodemailer");
const { getUrl } = require("./user");
const { google } = require("googleapis");

//Getting parameters from our environment variables and saving them to a new variable
const nodeMailerEmail = process.env.NODEMAILER_USER_EMAIL;
const nodeMailerPassword = process.env.NODEMAILER_USER_PASSWORD;

console.log(nodeMailerEmail);
console.log(nodeMailerPassword);

const sendResetPwdMail = async (email, firstname, id) => {
  try {
    let url = `http://localhost:3000/resetPassword/${id}`;
    let url2 = `"${getUrl()}/resetPassword/${id}`;
    let url3 = `https://ngotechprojectexplorer.herokuapp.com/resetPassword/${id}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodeMailerEmail,
        pass: nodeMailerPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mail = {
      from: "Great-NGO Project-Explorer ",
      to: email,
      subject: "Reset your Project Explorer password",
      html: `
           Hi <strong>${firstname}</strong>,
           <p>Having an issue with remembering your password? Well don't worry! </p>
           <p>Click the link below to complete your password reset process </p>
           <br> <a href="${url}">Click here to reset your password</a>
        `,
    };

    const result = await transporter.sendMail(mail);
    console.log("The result from sending ", result);

    if (result.accepted) {
      return [true, "User Reset Password link sent successfully."];
    } else {
      return [
        false,
        result.code,
        "Something went wrong in sending reset password link",
      ];
    }
  } catch (error) {
    console.log(error);
    return [
      false,
      error,
      "Something went wrong in sending reset password link to user.",
    ];
  }
};

const sendWelcomeMail = async (email, firstname) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodeMailerEmail,
        pass: nodeMailerPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
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
        `,
    };

    const result = await transporter.sendMail(mail);
    console.log("The result from sending ", result);

    if (result.accepted) {
      return [true, "User Welcome mail sent successfully."];
    } else {
      return [
        false,
        result.code,
        "Something went wrong in sending welcome mail to user.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [
      false,
      error,
      "Something went wrong in sending Welcome mail to user.",
    ];
  }
};

module.exports = { sendResetPwdMail, sendWelcomeMail };

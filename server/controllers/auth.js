require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  continueSignupValidator,
  validate,
  
} = require("../services/validation");

//Auth middleware
const authorize = require("../middleware/auth");

// OAuth2Client Google Authentication
const { OAuth2Client } = require("google-auth-library");
const { FindUserByEmail, createUser, getUserById, findUserById, updateUser, updateUserPassword } = require("../services/user");
const { translateError } = require("../services/mongo_helper");

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);


console.log("Google client id from node server ", process.env.REACT_APP_GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {

try {
        
    console.log("The req body for google login", req.body);

    const { token, googleId } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    console.log("The ticket ", ticket);
    
    let userSocialInfo = ticket.getPayload();

    console.log("User social info -", userSocialInfo);

    let firstname = userSocialInfo.given_name;
    let lastname = userSocialInfo.family_name;
    let email = userSocialInfo.email;
    let accountVerified = userSocialInfo.email_verified;
    let password = userSocialInfo.name;
    let profilePicture = userSocialInfo.picture;
    let matricNumber = userSocialInfo.at_hash;
    let googleID = googleId;

    let userExists = await FindUserByEmail(email);
    console.log("User exists ", userExists);

    // if(userExists[0] == true && userExists[1].program !== undefined && userExists[1].graduationYear !== undefined ) {
    if(userExists[0] == true ) {
        //The User already has an account
        userExists = userExists[1];
        // Create token
        const token = userExists.token;
        //Save token in a cookie and send back to the frontend
        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000*60*60*24,   //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
            httpOnly: true
        })
       
        const { _id, firstname, lastname, program, email, matricNumber, graduationYear, profilePicture } = userExists
        //To send back user info to client.
        let user ={_id, firstname, lastname, program, email, matricNumber, graduationYear, profilePicture}

        console.log("This user already has an account with this application and signed in with google ", user);
        return res.status(200).json({message: "User account already exists. User sign in with Google successful", status: "OK", user, redirectToContinueSignup:false})

    } else {
        // That User has signed up before
        let newUser = await createUser({firstname, lastname, email, accountVerified, password, matricNumber, profilePicture, googleID})
        console.log("The new User ", newUser);
        if(newUser[0] !== false ) {
            newUser = newUser[1];

            // Create token to send back to the User
            const token = newUser.token;
            //Save token in a cookie and send back to the frontend
            res.cookie('authToken', token, {
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000*60*60*24,   //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
                httpOnly: true
            })
    
            // Removing the details we don't want to see
            newUser.token=undefined;
            newUser.password=undefined;
    
            return res.status(200).json({ message: "Google sign up successful", redirectToContinueSignup:true, user:newUser, status: "OK" });
        
        } else {
            return res.status(400).json({error: "Google Sign In failed. Something went wrong.", actualError: newUser[1], status: "NOT OK" });

        }
    }

} catch (error) {
   console.log(error);
   return res.status(400).json({error: "Something Went wrong", actualError: translateError(error), status: "NOT OK", note:"Check your internet connection" });
     
}
});



router.put('/continueSignup/:id', continueSignupValidator(), validate, async(req, res) => {
    
    try {
        let { id } = req.params;
        // To make sure the id is valid
        let user = await findUserById(id);

        if (user[0] !== false) {
            console.log("The ID from req params", id);
            console.log("The request body", req.body);

            let { password, graduationYear, program, matricNumber} = req.body;
            // We update the user password first            
            let updatePassword = await updateUserPassword(id, password);
            console.log("The updated password ", updatePassword)

            let updateRemainingUserDetails = await updateUser(id, {graduationYear, program, matricNumber});
            console.log("Updated profile ", updateRemainingUserDetails);

            if(updateRemainingUserDetails&& updatePassword[0]==true) {
                let user = updateRemainingUserDetails;
                user.token=undefined;
                user.password=undefined;
                console.log("The user to be sent to the frontend ", user);
    
                res.status(200).json({message: "Continue Signup successful (Users correct info successfully saved)", status: "OK", user})
            }          
        } else {
            return res.status(400).json({error: "Something went wrong.", actualError: user[1], status: "NOT OK"});
        }


       
    
    } catch (error) {
        console.log("The error ", error)
    }


})



// Facebook Login route
// router.post("/facebook-login", async (req, res) => {
//   console.log("The req body for facebook login", req.body);


// });

module.exports = router;

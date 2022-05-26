require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { userSignupValidator, updateProfileValidator, validate, updatePasswordValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../services/validation');

//Auth middleware
const authorize = require("../middleware/auth");
const { upload } = require('../services/upload');
const fs = require('fs');
const { getUserById, updateUser, authenticate, encryptPassword, updateUserPassword, createUser, FindUserByEmail } = require('../services/user');
const { sendResetPwdMail } = require('../services/sendMail');


// To get a specific user details
router.get('/user/:id', async(req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    console.log("The user ", user);
    res.json({user})
})

router.post('/signup', userSignupValidator(), validate, async(req, res) => {

    try {
        console.log("CHECKKKK");
        console.log(req.body);
        const { firstname, lastname, email, password, program, matricNumber, graduationYear } = req.body;

        let user = await createUser({firstname, lastname, email, password, matricNumber, program, graduationYear})

        user = user[1];
        console.log(`The User is ${user}`)

        res.status(200).json({ message: "User Signup successful! Please login", status:"Signup OK"});

    } catch (error) {
        console.log(error)
    }

})

router.post('/login', loginValidator, async(req, res) => {

    try {
        
        const {email, password } = req.body;
        //Use authenticate method to check if our user exists
        let userExists = await authenticate(email, password)
        console.log("The user exists ", userExists)

        if (userExists[0]==true) {
            userExists = userExists[1];

            //Create token (Use saved token of user from our db)
            const token = userExists.token;

           //Save token in a cookie and send back cookie to the client
            res.cookie('authToken', token, {
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000*60*60*24, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours 
                httpOnly: true
            })
    
            const { _id, firstname, lastname, program, email, matricNumber, graduationYear, profilePicture } = userExists

            //To send back user info to client.
            let user ={
                _id, firstname, lastname, program, email, matricNumber, graduationYear, profilePicture
            }
    
            console.log(`The Logged in User :`, user)
            //Send success message and user response back to client
            res.status(200).json({message: "User log in successful!", user, status: "Login OK"})

        }
        else {
            return res.status(400).json({error: userExists[1]});
        }

    } catch (error) {
        console.log(error);
    }

})

// Upload middleware function from multer helps us parse our form req body which is a multipart/
router.put('/editProfile/:id', authorize, upload.single('profilePicture'), updateProfileValidator(), validate, async (req, res) => {
    // console.log("Req", req)
    let userId = req.params.id;
    console.log("The user id ", userId)
    console.log('Req.body ', req.body);
    console.log('Req.file ', req.file);

    // if(req.file.size > (7*1024*1024)) {     //7mb
    if(req.file&&req.file.size > (3*1024*1024)) {     //7mb
        console.log("Image should not be more than 7mb");
        // fs.unlinkSync(req.file.path)        //Remove the file
        let filePath = req.file.path
        fs.unlink(filePath, (err) => {
            if(err) {
                console.log("Error in deleting image ", err);  
            }
            else {
                console.log("Deleted file successfully");
            }
        })
        return res.status(400).json({errors: ["Image should not be more than 7mb"]})
        
    }
    else {

        console.log("You did smt")

        let filePath = req.file&&req.file.path
        console.log("FILE Path ", filePath)

        console.log("Dirname ", __dirname + "\n Filename ", __filename)

        let { firstname, lastname, email, program, matricNumber, graduationYear } = req.body;
        let fields = { firstname, lastname, email, program, matricNumber, graduationYear };

        if(filePath !== undefined) {
            fields.profilePicture = filePath
        }

        console.log("The fields - ", fields) 

        let check = await updateUser(userId, fields)

        const user = check;
        console.log("The user before removing secret info ", user)
       
        user.password =undefined; user.status = undefined;
        user.accountVerified = undefined; 
        user.token = undefined; 
        user.createdAt = undefined;
        user.updatedAt = undefined;
        user.__v = undefined

        console.log("The user after removing secret infor", user);

        if(check) {
            console.log("Updated User ", check);
            res.status(200).json({message: "User Profile updated successfully", status: "Update OK", user})
        }
   
    }

})

router.put('/removeProfilePicture/:id', authorize, async (req, res ) => {
    let { id } = req.params;

    let user = await getUserById(id);

    let removeProfilePic = process.env.DefaultProfilePicture;
    console.log("The profile picture ", removeProfilePic);
    console.log("The User to remove profile picture ", user)

    if(user.profilePicture === removeProfilePic) {
        return res.status(400).json({errors: ["You have no profile Picture"]});
    }
    user.profilePicture = removeProfilePic;
    let updatedUser = await updateUser(id, user);

    console.log("The updated User ", updatedUser);
    updatedUser.password = undefined; updatedUser.status = undefined; updatedUser.createdAt = undefined; updatedUser.updatedAt = undefined; updatedUser.__v = undefined; updatedUser.token = undefined; updatedUser.accountVerified= undefined;
    console.log("The updated user to be sent the frontend ", updatedUser);

    res.json({message: "Profile pic removed", status: "Update OK", user:updatedUser})

})

router.put('/editProfile/password/:id', authorize, updatePasswordValidator(), validate, async (req, res) => {
    let {id} = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;
   
    const tryUpdate = await updateUserPassword(id, confirmNewPassword)
    console.log("Edit user password  ", tryUpdate)

    res.json({message: "Password updated successfully", status: "Update OK"})
})

router.post('/forgotPassword', forgotPasswordValidator, async( req, res) => {
    console.log(req.body);

    const { email } = req.body;

    const check = await FindUserByEmail(email);
    console.log("check ", check);

    if (check[0] ==true) {
        const { firstname, _id } = check[1];
        let userId = _id;
        console.log(`{${email} \n${firstname} \n${userId}}`)
        // sendResetPwdMail(email, firstname, userId);
        res.json({message: "A reset password link has been sent to your email", status: "OK"})
    } 
    else {
        return res.status(400).json({error: check[1]})
    }

})


router.put('/resetPassword/:id', resetPasswordValidator(), validate, async (req, res) => {
    let {id} = req.params;
    console.log('From Reset password ', req.body);

    const { confirmNewPassword } = req.body;
   
    const tryUpdate = await updateUserPassword(id, confirmNewPassword)
    console.log("Reset user password ", tryUpdate)

    if(tryUpdate[0] === true) {
        res.json({message: "Password reset successfully", status: "Reset OK"})
    }
    else {
        return res.status(400).json({errors: ["OOPs! Something went wrong. Please try again later."]})
    }

})

module.exports = router;
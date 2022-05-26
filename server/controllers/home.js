require('dotenv').config();
const express = require('express');
const {getGradYears, getPrograms} = require("../services/school");
const router = express.Router();
const auth = require("../middleware/auth")

router.get('/programs', (req, res) => {
    const programs = getPrograms();
    // Sending the lists of programs (array) as a json response with a status of 200
    console.log("The programs ", programs);
    // res.status(200).json({data: programs})
    res.status(200).json(programs)

})

router.get('/graduationYears', (req, res) => {
    const gradYears = getGradYears();
    // Sending the list of graduation years (array) as a json response with a status of 200
    res.status(200).json(gradYears)
    // res.status(200).json({data: gradYears}) // res.status(200).json({gradYears})      

})

router.get('/welcome', auth, (req, res) => {
    res.status(200).send("WELCOMEEEEE");
})

router.post('/welcome', auth, (req, res) => {
    res.status(200).send("WELCOMEEEEE");
})


router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: "Logout Successful"});
})

module.exports = router;
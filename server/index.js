//Load database configuration file and allow us read environment variables
require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const app = express();
const http = require("http");
const PORT = process.env.PORT || process.env.SERVER_PORT
const cookieParser = require("cookie-parser");
const path = require('path');   //The path module
const fs = require("fs");
// const cors = require('cors');

// To allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
});
// app.use(cors());

//To allow json requests and decode requests from forms
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//To allow Cookies
app.use(cookieParser());


// Api Docs
app.get("/", (req, res) =>  {
    fs.readFile('api/docs/apiDocs.json', (err, data) => {
        if(err) {
            res.status(400).json({error:err})
        }
        const docs = JSON.parse(data);  //We have to parse the data because it is a buffer, JSON.parse converts into JSON a readable format.
        console.log("THe docs", docs);
        res.json(docs);
    })
})

//Routes
app.use('/api', require("./controllers/auth"));
app.use('/api', require("./controllers/home"));
app.use('/api', require("./controllers/user"));
app.use('/api', require("./controllers/project"));


// To show public files/Files from uploads folder
app.use("/api/uploads", express.static('api/uploads'));
// app.use("/api/uploads", express.static('uploads'));      //Would use when i upload to cloudinary
console.log("PATH ", path.join(__dirname, '/api/uploads'));
// app.use(express.static(path.join(__dirname, 'uploads')))
// app.use("/uploads", express.static('uploads'));


//Invalid Route     //NB: using app.use instead of app.get/post handles all wrong requests and throws the message
app.use('*', (req, res) => {
    res.status(404).send({error: "Route does not exist"})
})

//Server setup
const server = http.createServer(app)
//If any error in starting server
server.on('error', (err) => {
    console.log(`Error Present: ${err}`);
    process.exit(1);
})
//Starting Server/Listening to server
server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
})

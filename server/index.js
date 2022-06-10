//Load database configuration file and allow us read environment variables
require('dotenv').config();
const { connectToDB } = require("./config/database");

const express = require('express');
const app = express();
const http = require("http");
const PORT = process.env.PORT || process.env.SERVER_PORT
const cookieParser = require("cookie-parser");
const path = require('path');   //The path module
const fs = require("fs");
const cors = require('cors');

// To allow CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next()
// });

// Cors configuration
const corsOptions = {
    origin: [
      "http://localhost:3000",
      // "https://ngotechprojectexplorer.herokuapp.com"
    ],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
// // To allow CORS
app.use(cors(corsOptions));
// app.use(cors());

//To allow json requests and decode requests from forms
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//To allow Cookies
app.use(cookieParser());


// Api Docs
app.get("/api", (req, res) =>  {
    const apiDocsFile = path.join(__dirname, '/api/docs/apiDocs.json')

    fs.readFile(apiDocsFile, (err, data) => {
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
app.use('/api', require("./controllers/comment"));

// To show public files/Files from uploads folder
app.use("/api/uploads", express.static('uploads'));      //Would use when i upload to cloudinary
const clientBuildUrl = path.join(__dirname, "..", '/client/build')
console.log(path.resolve(__dirname, "../client", "build", "index.html") );

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static(clientBuildUrl));
    app.get("*", (req, res) => {
      res.sendFile(
        path.resolve(__dirname, "../client", "build", "index.html")
      );
    });
  }
  
//Invalid Route     //NB: using app.use instead of app.get/post handles all wrong requests and throws the message
app.use('*', (req, res) => {
    res.status(404).send({error: "Route does not exist"})
})

// Logging the rejected field from multer error
app.use((error, req, res, next) => {
    console.log("This is the rejected field ->", error);
    // console.log("This is the rejected field ->", error.field);
    res.status(400).json({ error: "Multer Error. Unexpected field -  ", error });
  });
  
  //Server and Database setup
  const server = http.createServer(app);
  // Only start server after connection to database has been established
  connectToDB()
    .then(() => {
      //Starting Server/Listening to server
      server.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
      });
    })
    .catch(() => {
      console.log("Database connection failed!");
    });
  
  //If any error in starting server
  server.on("error", (err) => {
    console.log(`Error Present: ${err}`);
    process.exit(1);
  });
  
  // If any unhandledRejection in our process Event
  process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION! Shutting down...", error);
    process.exit(1);
  });
  
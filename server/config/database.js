// Database Configuration files
const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

exports.connect = () => {
  //To disable buffering  
  mongoose.set("bufferCommands", false);

  //Connecting to the database.
  mongoose.connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err)
        console.log("Error connecting to database: ", err);
      else {
        console.log(`Successfully connected to MongoDB @ ${MONGODB_URI}`);
      }
    }
  );
};

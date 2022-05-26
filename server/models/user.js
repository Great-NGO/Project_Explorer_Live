// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    facebookID: { type: String, unique: true },
    googleID: { type: String, unique: true },
    accountVerified: {
      type: Boolean,
      default: false,
      
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    matricNumber: { type: String, required: true },
    program: { type: String },
    graduationYear: { type: String },
    token: { type: String },
    // salt: { type: String, required: true },
    profilePicture: { type: String, default: 'https://res.cloudinary.com/ngotech-dev/image/upload/v1638195018/main/avatar_yceqqb.png' },
    // notification: [{}]
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;

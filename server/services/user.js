require('dotenv').config();
const User = require("../models/user");
const { translateError } = require("./mongo_helper");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


// Generate password salt and hash
const encryptPassword = async (password) => {
  // const salt = await bcrypt.genSalt(12)
  // return await bcrypt.hash(password, salt)
  return await bcrypt.hash(password, 10)
}

/* Return user with specified id */
const getUserById = async (id) => {

  try {
      const user = await User.findById(id);
      if(user !== null) {
          return [true, user];
      }
      else {
          return [false, "User doesn't exist. It is null and/or has been deleted."];
      }
    } catch (error) {
        console.log(translateError(error));
        return [false, translateError(error)];
    }
  };


/* Create new User */
const createUser = async ({ firstname, lastname, email, password, matricNumber, program, graduationYear, accountVerified, profilePicture,  picturePublicCloudinaryId, googleID}) => {
  try {
    let user = new User({
      firstname,
      lastname,
      email,
      password: await encryptPassword(password),
      matricNumber,
      program,
      graduationYear,
      accountVerified,
      profilePicture,
      picturePublicCloudinaryId,
      googleID

    })

    //Create a token //jwt.sign(payload, secretOrPrivateKey, [options, callback])  e.g // const token = jwt.sign({ user_id: user._id}, process.env.JWT_SECRET, { expiresIn: '2h'})
    const token = jwt.sign({ user_id: user._id}, process.env.JWT_SECRET);

    user.token = token

    if( await user.save()) {
      return [true, user]
    }


  } catch (error) {
    console.log(error);
    return [false, translateError(error)] 
  }
}




const authenticate = async(email, password) => {
  const user = await User.findOne({ email})

  if(user && (await bcrypt.compare(password, user.password))) {
    return [true, user];
  } else {
    return [false, "Incorrect email/password"]
  }
}

/* Update user profile */
// const updateUser = async (id, fields) => await User.findByIdAndUpdate(id, fields, { new: true})
const updateUser = async (id, fields) => {
 try {
   const user = await User.findByIdAndUpdate(id, fields, { new: true})
   if(user !== null) {
     return [true, user]
   } else {
    return [false, "User doesn't exist. User is null and/or has been deleted.", "Something went wrong."];
   }

 } catch (error) {
  return [false, translateError(error), "Something went wrong"];
 }
}

/* Update User Password */
const updateUserPassword = async(id, password) => {
  try {
    const userWithPassword = await User.findByIdAndUpdate(id, {password: await encryptPassword(password)}, {new: true});
    if(userWithPassword !== null ) {
      return [true, userWithPassword]
    } else {
      return [ false, "User with id and password does not exist. User is null and/or has been deleted."]
    }

  } catch (error) {
      console.log(error);
      return [false, translateError(error), "Something went wrong"]  
  }
}

/* Delete a User's account */
const deleteUser = async (id) => {
  try {
      const deletedUser = await User.findByIdAndDelete(id)
      if(deletedUser) {
          // Would also have to delete all associated users project and comments
          return [true, deletedUser]
      } else{
          return [false, "User doesn't exist. User is null and/or has been deleted."]

      }

  } catch (error) {
      return [false, translateError(error)];
      
  }
}

/* Get the current url */
//NB: NODE_ENV specifies the environment in which an application is running
const getUrl = () => {
  console.log(process.env.NODE_ENV);
  return process.env.NODE_ENV === "development" ? "http://localhost:4000" : "https://ngotechprojectexplorer.herokuapp.com"
}

/* Get user by email */
const FindUserByEmail = async (email) => {
  // const user = await User.findOne ({'email':email});
  const user = await User.findOne ({email});
  if (user!==null) {
    return [true, user]
  }
  else {
    return [false, "User with that email doesn't exist"]
  }
}

  module.exports = {
      createUser,
      getUserById,
      updateUser,
      authenticate,
      encryptPassword,
      updateUserPassword,
      getUrl,
      FindUserByEmail,
      deleteUser
  }
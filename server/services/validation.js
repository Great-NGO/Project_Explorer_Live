//ERROR HANDLING
const { check, body, validationResult } = require("express-validator");
const User = require("../models/user");
const { getUserById, authenticate, FindUserByEmail } = require("./user");
const {getGradYears, getPrograms} = require("../services/school");


const userSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("email").custom(async(value) => {
      let userExist = await User.findOne({'email':value})   
      if(userExist!==null) {
        console.log("The User already exists");
        //Return a Promise.reject() because the validation works and should throw an error message. Also, custom validators return promises for async functions
       return Promise.reject()
      }
    
    }).withMessage("Email is taken! If it belongs to you, please login!"),
     
    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("lastname", "Last Name is required").trim().notEmpty().isLength({ min: 3 }),
    //Email validation
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
    //Password validation
    body("password", "Password is required").notEmpty(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long")
    //   .matches(/\d/)
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage("Password must be a combination of at least one upper and lower case letter, one symbol and one number (e.g. PaS$@WO123D)."),
    body("matricNumber", "Matric Number is required").trim().notEmpty(),
  ];
};


const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  if(!(email && password)) {
    return res.status(400).json({error: "Please Login with valid email and password"})
  } else {
    console.log("Details from Login form", req.body)
    next();
  }
}

const forgotPasswordValidator = (req, res, next) => {
  const { email } = req.body;
  if(!(email) || email.includes('@')===false) {
    return res.status(400).json({error: "Please enter your email! Email can't be empty and must be valid"})
  } else {
    console.log("Details from Login form", req.body)
    next();
  }
}

const createProjectValidator = () => {
  return [
    //Name, abstract must not be empty
    body("name", "Project name is required").trim().notEmpty(),
    body("abstract", "Enter a description for your project").trim().notEmpty(),
    body("abstract", "Project description must contain atleast 50 words").isLength({ min: 50}),

    //Authors and tags 
    body("authors", "Enter Project Author(s) separated with a comma (,) ").trim().notEmpty(),
    // body("authors", "Author(s) name must be true and correct").matches(/[a-zA-Z][a-zA-Z][a-zA-Z]/).isLength({min: 5}),
    body("authors", "Author(s) name must be true and correct").matches(/[a-zA-Z][a-zA-Z][a-zA-Z]/),   //Name must contain atleast 3 characters... Could make the validation to be at least 6 because of fullname
    // body("authors", "Enter Project Author(s) rightly. No whitespaces or incorrect characters allowed!").custom(value => value.trim().length !== 0).matches(/[a-zA-Z]/),
    body("tags","Enter Project tag(s) separated with a #").trim().notEmpty().matches(/[a-zA-Z][a-zA-Z]/)    //Taga must contain atleast 2 letters

  ]
}

const updateProfileValidator = () => {
  return [
    //Check that email isn't taken
    check("email").custom(async(value, {req}) => {
      const { id } = req.params;
      let userExist = await FindUserByEmail(value);
      console.log("Exists? ", userExist)
      if(userExist[1]._id == id) {
        console.log("User's email didn't change. Still the same email for User. ", userExist[1]._id == id);
      } 
      if(userExist[0]!==false && userExist[1]._id != id) {
        console.log("The User already exists");
        return Promise.reject()
      }
          
    }).withMessage("Another User with that email already exists."),
           
    body("firstname", "First Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("lastname", "Last Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
    body("matricNumber", "Matric Number is required").trim().notEmpty(), 
    body("graduationYear", "Please Select your Graduation Year").notEmpty(),
    body("program", "Please Select your program")
  ]
}

const updatePasswordValidator = () => {

  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword").custom(async (value, {req}) => {

      const { id } = req.params;
      const user = await getUserById(id);
      const { email } = user;
      
      let check = await authenticate(email, value);
      console.log("Check ", check)

      if(check[0]==false) {
        console.log("Current password is incorrect");
        return Promise.reject()
      }

    }).withMessage("Current Password is incorrect"),
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword").custom((value, {req} ) => {
      console.log("FROM Validator req body", req.body)
      const { newPassword } = req.body
 
      if(value===newPassword) {
        console.log("Passwords are the same.. Validation passed", value===newPassword);
        return true;
      } else {
        console.log("Passwords must be the same.. Validation test failed", value===newPassword);
        return false;
        // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
      }
    })
    .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
    .isStrongPassword({ minLength:8, minLowercase:1, minUppercase:1, minNumbers:1})
    .withMessage("New Password must be strong - a combination of at least one upper and lower case letter, one symbol and one number (e.g. PaS$@WO123D)."),
  ]
}

const resetPasswordValidator = () => {
  return [
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword").custom((value, {req} ) => {
      console.log("FROM Validator req body", req.body)
      const { newPassword } = req.body
      if(value===newPassword) {
        console.log("Passwords are the same.. Validation passed", value===newPassword);
        return true;
      } else {
        console.log("Passwords must be the same.. Validation test failed", value===newPassword);
        return false;
        // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
      }
    })
    .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
    .isStrongPassword({ minLength:8, minLowercase:1, minUppercase:1, minNumbers:1})
    .withMessage("New Password must be strong - a combination of at least one upper and lower case letter, one symbol and one number (e.g. PaS$@WO123D)."),
  ]
}

const continueSignupValidator = () => {
  return [
    body("password", "Please enter your Password.").trim().notEmpty(),
    check("password")
    .isStrongPassword({ minLength:8, minLowercase:1, minUppercase:1, minNumbers:1})
    .withMessage("Password must be strong - a combination of at least one upper and lower case letter, one symbol and one number (e.g. PaS$@WO123D)."),
    body("matricNumber", "Please Enter your correct matric Number").trim().notEmpty(),
    body("graduationYear", "Please Select your Graduation Year").notEmpty(),
    body('graduationYear', "Please Select your Graduation Year").custom((value, {req}) => {
      const graduationYears = getGradYears();   //To get our array of graduation years
      console.log("The graduation years from continueSignup validator ",graduationYears);
      if (!graduationYears.includes(value)) {
        throw new Error('No Graduation Year selected.');
      }
      return true;
    }),
    body("program", "Please Select your program").notEmpty(),
    body('program', "Please Select your Program").custom((value, {req}) => {
      const programs = getPrograms();   //To get our array of programs
      if (!programs.includes(value)) {
        throw new Error('No Program selected.');
      }
      return true;
    })
  ]
}


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  errors.array().map((err) => extractedErrors.push( err.msg ));


  return res.status(400).json({
    errors: extractedErrors,
  });

 
};

module.exports = {
  userSignupValidator,
  validate,
  loginValidator,
  createProjectValidator,
  updateProfileValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  continueSignupValidator,

};

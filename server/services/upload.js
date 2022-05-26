const cloudinary = require('../services/cloudinary');
const fs = require('fs');
const multer = require('multer');
const { v4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, './uploads')
        cb(null, './api/uploads')   //To make the image accessible even while on localhost
    },
    filename: function(req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, v4() + '-' + fileName)
    }
})

// var upload = multer({storage: storage});
var upload = multer({
    storage: storage,
    // limits: {fileSize: 10485760}, //10mb (10 * 1024 * 1024)
    // fileFilter: (req, file, cb) => {
    //     if( file.size > 10485760) {
    //         cb(null, false);
    //         return cb(new Error("Image should not be more than 10mb"))
    //     }
    //     else {
    //         cb(null, true)
    //     }
    // }

});

module.exports = {
    upload
}
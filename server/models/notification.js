// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
    notificationOwner: { type: mongoose.ObjectId, ref: "user"},
    notificationMaker: { type: mongoose.ObjectId, ref: "user" },
    actionType: {
        type: String,
        enum: {
            values: ['Like', 'Reply', 'Comment'],
            message: '{VALUE} is not supported'
        }
    },
    projectId: {type: mongoose.ObjectId, ref: "project"},
    commentId: {type: mongoose.ObjectId, ref: "comment"},
    date: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);
module.exports = Notification;

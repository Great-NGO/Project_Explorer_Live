// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
    commentAuthor: { type: mongoose.ObjectId, ref: "user" },
    projectID: { type: mongoose.ObjectId, required:true, ref: "project" },
    text: { type: String, required: true },
    likes: [{ type:mongoose.ObjectId, ref: "commentLikes"}],
    date: {
        type: Date,
        default: Date.now
    },
    replies: [{type: mongoose.ObjectId, ref: "commentReply"}]
},
    { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;

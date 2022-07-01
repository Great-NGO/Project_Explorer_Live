// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentReplySchema = new Schema({
    replyAuthor: { type: mongoose.ObjectId, ref: "user" },
    commentID: { type: mongoose.ObjectId, required:true, ref: "comment" },
    text: { type: String, required: true },
    likes: [{ type:mongoose.ObjectId, ref: "commentLikes"}],
    date: {
        type: Date,
        default: Date.now
    } 
},
    { timestamps: true }
);

const CommentReplies = mongoose.model("commentReply", commentReplySchema);
module.exports = CommentReplies;

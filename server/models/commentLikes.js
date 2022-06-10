// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentLikesSchema = new Schema({
    likerId: { type: mongoose.ObjectId, ref: "user" },
    commentId: {type: mongoose.Schema.Types.ObjectId, ref: "comment"}
},
    { timestamps: true }
);

const CommentLikes = mongoose.model("commentLikes", commentLikesSchema);
module.exports = CommentLikes;

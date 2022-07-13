// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    abstract: { type: String, required: true },
    authors: { type: [String], required: true },
    tags: [String],
    createdBy: { type: mongoose.ObjectId, required: true, ref: "user" },
    comments: [{ type: mongoose.ObjectId, ref: "comment" }],
    // comments: [
    //   {
    //     commentAuthor: { type: mongoose.ObjectId, ref: "user"},
    //     comment: { type: String},
    //     likes: [ {type:mongoose.ObjectId, ref: "commentLikes"}],
    //     replies: [
    //       {
    //         replyAuthor: { type: mongoose.ObjectId, ref: "user"},
    //         reply: { type: String},
    //         likes: [ {type: mongoose.ObjectId, ref: "commentLikes"}],
    //         dateCreated: {
    //           type: Date,
    //           default: Date.now
    //         }
    //       }
    //     ],
    //     dateCreated: {
    //       type: Date,
    //       default: Date.now
    //     }
    //   }
    // ],   //Comments could have also been created like this... Replies would be a nested array inside comments
    // For Searching feature - to get the amount of times a project has been viewed by a user and the particular date it was viewed
    lastVisited: [
      {
        userId: {
          type: mongoose.ObjectId,
          ref: "user",
        },
        count: {
          type: Number,
          default: 0
        },
        date: {
          type: Date,
          default: Date.now,
        },
        _id:false
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", ProjectSchema);

module.exports = Project;

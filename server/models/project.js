// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  abstract: { type: String, required: true },
  authors: { type: [String], required: true, unique: true},
  tags: [String],
  createdBy: { type: mongoose.ObjectId, required: true, ref: "user"},
  comments: [{type: mongoose.ObjectId, ref: "comment"}]
}, {
    timestamps: true
});

const Project = mongoose.model("project", ProjectSchema)

module.exports = Project;
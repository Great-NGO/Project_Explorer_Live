const express = require('express');
const router = express.Router();
const authorize = require("../middleware/auth");
const Project = require("../models/project");
const { createProject, getLast4Projects, getProjectById, updateProject, deleteProject } = require('../services/project');
const { getUserById } = require('../services/user');
const { createProjectValidator, validate } = require('../services/validation');


//Returns the latest 4 projects to our frontend
router.get('/projectsShowcase', async (req, res) => {
    const projectShowcase = await getLast4Projects();
    console.log('ProjectShowCase: ', projectShowcase);

    res.json({projects: projectShowcase})
})

//To get a specific project
router.get('/project/:id', async (req, res) => {
    // console.log('Req user from project route', req);
    const { id } = req.params;
    const project = await getProjectById(id);
    console.log('The specific project', project);
    res.json({project})
})

router.post('/projects/submit', authorize, createProjectValidator(), validate, async (req, res) => {
    
    console.log(req.body);
    console.log('Req user', req.user);

    let {name, abstract, authors, tags } = req.body;

    const userId = req.user.user_id
    const user = await getUserById(userId);
    console.log("The user and the user object", user);

    const createdBy = user._id;

    //Convert authors and tags properties from the request body to an array and filter any whitespace
    authors = authors.split(",").filter((author) => author !== "")
    tags = tags.split("#").filter((tag) => tag !== "");

    //Trim off any white space for authors and tags before saving in the database
    authors = authors.map((element) => element.trim())
    tags = tags.map((element) => element.trim())

    //To add a #symbol to the first element in our tag arrays
    tags[0] = `#${tags[0]}`;
    
    let project = await createProject({name, abstract, authors, tags, createdBy})
    project = project[1];
    console.log('project', project)

    res.status(200).json({message: "Project creation successful", status: "Submission OK"})

})

router.put('/editProject/:id', authorize, createProjectValidator(), validate, async (req, res) => {
    console.log('req.body', req.body);
    const { id } = req.params;
    const userId = req.user.user_id;

    const project = await getProjectById(id);
    let createdById = project.createdBy._id;

    createdById = createdById.toString();   

    console.log("Is Logged in user the project owner? (True/False) :", createdById === userId )
    // A Logged in user that didn't create the project can not edit it
    if( createdById !== userId) {
        return res.status(400).json({errors: ["Unauthorized access! Can't edit project because you are not the Project owner"]})
    }

    console.log("Project from edit project", project);
    let { name, abstract, authors, tags } = req.body;

    //Convert authors and tags properties from the request body to an array and filter any whitespace
    authors = authors.split(",").filter((author) => author !== "")
    tags = tags.split("#").filter((tag) => tag !== "");
    //Trim off any white space for authors and tags before saving in the database
    authors = authors.map((element) => element.trim());
    tags = tags.map((element) => element.trim());
    //To add a #symbol to the first element in our tag arrays
    tags[0] = `#${tags[0]}`;

    let fields = { name, abstract, authors, tags} ;

    let check = await updateProject(id, fields);
    if(check) {
        console.log("Updated Project ", check);
        res.json({message:"Project updated successfully", status: "Update OK",  project:check})
    }

})

router.delete('/deleteProject/:id', authorize, async (req, res) => {

    console.log('Delete route');
    const { id } = req.params;
    const userId = req.user.user_id;
    const project = await getProjectById(id);
    let createdById = project.createdBy._id;
   
    createdById = createdById.toString()    //To match it with userId
    // A Logged in user that didn't create the project can not edit it
    if( createdById !== userId) {
        return res.status(400).json({errors: ["Unauthorized access! Can't delete project because you are not the Project owner"]})
    }

   const deletedProject = await deleteProject(id);

   console.log('Deleted Project ', deletedProject);

   if(deletedProject) {
       return res.status(200).json({message: "Project deleted successfully", status: "Deletion OK"})
   }

//    return res.status(200).json({message: "Project deleted successfully", status: "Deletion OK"})

})

module.exports = router
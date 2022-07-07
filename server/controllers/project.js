const { response } = require('express');
const express = require('express');
const router = express.Router();
const { authorize, checkUser } = require("../middleware/auth");
const { createProject, getLast4Projects, getProjectById, updateProject, deleteProject, updateLastViewed } = require('../services/project');
const { getUserById } = require('../services/user');
const { createProjectValidator, validate } = require('../validator/index');

//Returns the latest 4 projects to our frontend
router.get('/projectsShowcase', async (req, res) => {
    const projectShowcase = await getLast4Projects();
    console.log('ProjectShowCase: ', projectShowcase);

    res.json({projects: projectShowcase})
})

//To get a specific project
router.get('/project/:id', checkUser, async (req, res) => {

    const { id } = req.params;
    let user = req.user;
    console.log("The user ", user);
    const project = await getProjectById(id);
    console.log('The specific project', project);
    if(project[0] !== false) {
        if(user !== undefined) {
            let userId = user.user_id;
            let updateUserLastSeen = await updateLastViewed(id, userId);    //This updates the last viewed property of the project and returns the result
            console.log("Update User last seen ", updateUserLastSeen);
        }
        res.json({project:project[1], status:"OK"});
        
    } else {
        return res.status(404).json({error: project[1], status: "error"})
    }
})

router.post('/projects/submit', authorize, createProjectValidator(), validate, async (req, res) => {
    
    console.log(req.body);
    console.log('Req user', req.user);

    let {name, abstract, authors, tags } = req.body;

    const userId = req.user.user_id
    const user = await getUserById(userId);
    console.log("The user and the user object", user);

    const createdBy = user[1]._id;

    //Convert authors and tags properties from the request body to an array and filter any whitespace
    authors = authors.split(",").filter((author) => author !== "")
    tags = tags.split("#").filter((tag) => tag !== "");

    //Trim off any white space for authors and tags before saving in the database
    authors = authors.map((element) => element.trim())
    tags = tags.map((element) => element.trim())

    //To add a #symbol to the first element in our tag arrays
    // tags[0] = `#${tags[0]}`;
    
    let project = await createProject({name, abstract, authors, tags, createdBy})
    if(project[0] !== false) {
        project = project[1];
        console.log('project', project)
        res.status(200).json({message: "Project creation successful", status: "Submission OK"})    
    } else {
        return res.status(400).json({error: project[1], status: "error"})
    }
 
})

router.put('/editProject/:id', authorize, createProjectValidator(), validate, async (req, res) => {
    try {
        console.log('req.body', req.body);
    const { id } = req.params;
    const userId = req.user.user_id;

    const project = await getProjectById(id);
    if(project[0] !== false) {
        let createdById = project[1].createdBy._id;

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
        // tags[0] = `#${tags[0]}`;
    
        let fields = { name, abstract, authors, tags} ;
    
        let check = await updateProject(id, fields);
        if(check[0] !== false) {
            console.log("Updated Project ", check);
            res.status(201).json({message:"Project updated successfully", status: "Update OK",  project:check[1], data:check[1]})
        } else {
            return res.status(400).json({error: check[1], status: "error"})
       }
    } else {
        return res.status(422).json({error: project[1], status: "error"})
    }

    } catch (error) {
        return res.status(400).json({error: error, status: "error"})
    }

})

router.delete('/deleteProject/:id', authorize, async (req, res) => {

    console.log('Delete route');
    const { id } = req.params;
    const userId = req.user.user_id;
    const project = await getProjectById(id);

    if(project[0] !== false) {
        let createdById = project[1].createdBy._id;
   
        createdById = createdById.toString()    //To match it with userId
        // A Logged in user that didn't create the project can not edit it
        if( createdById !== userId) {
            return res.status(401).json({errors: ["Unauthorized access! Can't delete project because you are not the Project owner"]})
        }
    
       const deletedProject = await deleteProject(id);
       console.log('Deleted Project ', deletedProject);
    
       if(deletedProject[0] !== false) {
           return res.status(200).json({message: "Project deleted successfully", status: "Deletion OK"})
       } else {
            return res.status(422).json({error: deletedProject[1], status: "error"})
       }
    } else {
        return res.status(422).json({error: project[1], status: "error"})
    }
  

})

module.exports = router
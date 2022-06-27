const Project = require("../models/project");
const { translateError } = require("./mongo_helper");

/* Create new Project */
const createProject = async ({ name, abstract, authors, tags, createdBy }) => {
  try {
    const project = new Project({
      name,
      abstract,
      authors,
      tags,
      createdBy
    })

    if (await project.save()) {
      return [true, project];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

const getLast4Projects = async () => {
  try {
    const projectShowcase = await Project.find({}).sort({ _id: -1 }).limit(4); //Return last 4 projects in descending order (Most recent)
    return projectShowcase;
  } catch (error) {
    console.log(error);
    return translateError(error);
  }
};

const getAllProjects = async ({page=1}) => {
  try {
    //Return all projects with a page limit of 8 projects per page
    const pageLimit = 8;
    const projects = await Project.find({}).sort({_id:-1}).skip( (page-1)*pageLimit).limit(pageLimit); //Return all projects (8 per page) in descending order (Most recent)
    const numOfProjects = await Project.find({}).countDocuments()
    const allProjectPages = Math.ceil(numOfProjects/pageLimit);
    return [true, projects, numOfProjects, allProjectPages ];
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return a Project with Specified id */
const getProjectById = async (id) => {
  try {
    const project = await Project.findById(id).populate([
      {
        path: "createdBy",
        select: "_id firstname lastname email profilePicture"
      },
      {
        path: "comments",
        populate: [
          { path: "likes" },
          {
            path: "commentAuthor",
            select: "_id firstname lastname email profilePicture",
          },
          {
            path: "replies",
            populate: [
              {
                path: "replyAuthor",
                select: "_id firstname lastname email profilePicture"
              },
              { path: "likes" },
            ],
          },
        ],
      },
    ]);
    if (project !== null) {
      return [true, project];
    } else {
      return [
        false,
        "Project doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Update Project */
const updateProject = async (id, fields) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(id, fields, {
      new: true,
    }).populate([
      {
        path: "createdBy",
        select: "_id firstname lastname email profilePicture",
      },
      {
        path: "comments",
        populate: [
          { path: "likes" },
          {
            path: "commentAuthor",
            select: "_id firstname lastname email profilePicture",
          },
          {
            path: "replies",
            populate: [
              {
                path: "replyAuthor",
                select: "_id firstname lastname email profilePicture"
              },
              { path: "likes" },
            ],
          },
        ],
      },
    ]);
    if (updatedProject !== null) {
      return [true, updatedProject];
    } else {
      return [
        false,
        "Project doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

/* Delete Project */
const deleteProject = async (id) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (deletedProject) {
      // Would also have to delete comments id and replies and notifications under a particular project
      return [true, deletedProject];
    } else {
      return [
        false,
        "Project doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const updateLastViewed = async(id, userId) => {
  let project = await Project.findById(id);
  console.log("Project ", project);

  let userProject = await Project.findOne({id:id, 'lastVisited.userId':userId})
  console.log("User Project ", userProject);

  // If a user has never viewed a project before, update the project last visited array to include the users view and the date
  if(userProject == null) {

    project.lastVisited.map((elem) => {
      console.log("The elenm", elem)
    })

    let updatedProjectWithLastVisited = await Project.findByIdAndUpdate(id, {$set: {lastVisited: project.lastVisited.addToSet({userId, count:1, date: Date.now()}) }}, {new:true})
    console.log("Updated project ", updatedProjectWithLastVisited)
    return [true, updatedProjectWithLastVisited]
  } 
  // Update the date and count of the last time the user has viewed the project
  else {

    project.lastVisited.map((elem) => {
      console.log("The elenm", elem)
    })

    let viewCount = userProject.lastVisited[0].count;
    console.log("The count ", viewCount);

    let updatedProjectWithLastVisited = await Project.findByIdAndUpdate(id, {$set: {lastVisited: project.lastVisited.addToSet({userId, count:viewCount+1, date: Date.now()}) }}, {new:true})
    console.log("Updated project with changed date and count", updatedProjectWithLastVisited)
    return [true, updatedProjectWithLastVisited, "Count increased and Date updated"]

  }

}

module.exports = {
  createProject,
  getLast4Projects,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateLastViewed
};

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

const getAllProjects = async () => {
  try {
    const projects = await Project.find({}).sort({ _id: -1 }); //Return all projects in descending order (Most recent)
    return projects;
  } catch (error) {
    console.log(error);
    return translateError(error);
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

module.exports = {
  createProject,
  getLast4Projects,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

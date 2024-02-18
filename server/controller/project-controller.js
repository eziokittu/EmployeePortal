const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Project = require('../models/project');

const getProjects = async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching projects failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({projects: projects.map(project => project.toObject({ getters: true }))});
};

const getProjectsCompletedCount = async (req, res, next) => {
  let projectsCount;
  try {
    projectsCount = await Project.countDocuments({isCompleted: true});
  } catch (err) {
    const error = new HttpError(
      'Fetching completed projects count failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({count: projectsCount});
};

const getProjectsOngoingCount = async (req, res, next) => {
  let projectsCount;
  try {
    projectsCount = await Project.countDocuments({isCompleted: false});
  } catch (err) {
    const error = new HttpError(
      'Fetching ongoinf projects count failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({count: projectsCount});
};

// POST

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    // const { title, description } = req.body;
    const { title, startDate, endDate } = req.body;

    const createdProject = new Project({
      title: title,
      // description: description,
      date_start: startDate,
      date_end: endDate
    });

    await createdProject.save();

    res.status(201).json({
      createdProject
    });
  } 
  catch (err) {
    console.error(err); // Log the error for debugging
    return next(new HttpError('Creating project failed!, please try again later.', 500));
  }
}

// PATCH

// updates project, req.params provides the id
const updateProjectInfo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description } = req.body;

    const projectId = req.params.pid;

    // Find the existing project by projectId
    const existingProject = await Project.findOne({ projectId: projectId });
    if (!existingProject) {
      return next(new HttpError('Project not found, update failed.', 404));
    }
    
    // Update project details
    existingProject.title = title;
    existingProject.description = description;

    // Save the updated user
    await existingProject.save();

    res.status(200).json({ project: existingProject.toObject({ getters: true }) });
  } 
  catch (err) {
    console.error(err); // Log the error for debugging
    return next(new HttpError('Creating project failed!, please try again later.', 500));
  }
}

// DELETE

const deleteProject = async (req, res, next) => {
  // console.log(req.params.pid);
  const { projectId } = req.body;
	let project;
  try {
    // project = await Project.findById(req.params.pid);
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find project to delete.',
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError('Could not find project for this id.', 404);
    return next(error);
  }

  // Check if Admin
  // if (req.userData.isAdmin !== true) {
  //   const error = new HttpError(
  //     'You are not allowed to delete this product.',
  //     401
  //   );
  //   return next(error);
  // }

  try {
    await Project.deleteOne(project);
  } 
  catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong[4], could not delete project.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted project.' });
};

// const addEmployee = async(req, res, next) => {
//   try{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return next(new HttpError('Invalid inputs passed, please check your data.', 422));
//     }

//     const { userId, projectId } = req.body;

//     // Find the existing project by projectId
//     const existingProject = await Project.findOne({ projectId: projectId });
//     if (!existingProject) {
//       return next(new HttpError('Project not found, update failed.', 404));
//     }
    
//     // Update project details
//     existingProject.employees = title;
//     existingProject.description = description;

//     // Save the updated user
//     await existingProject.save();
//   } 
//   catch (err) {
//     console.error(err); // Log the error for debugging
//     return next(new HttpError('Creating project failed!, please try again later.', 500));
//   }
// }

module.exports = {
  getProjects,
  getProjectsCompletedCount,
  getProjectsOngoingCount,
  createProject,
  updateProjectInfo,
  deleteProject
  // addEmployee
};
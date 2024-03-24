const { validationResult } = require('express-validator');

const fs = require('fs');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Domain = require('../models/domains');
const Project = require('../models/project');

const getProjects = async (req, res, next) => {
  const page = req.query.page || 0;
  const projectsPerPage = 2;

  let allProjects;
  try {
    allProjects = await Project
      .find()
      .skip(page * projectsPerPage)
      .limit(projectsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
    // res.json({
    //   ok: -1,
    //   message: "Error in fetching projects",
    // });
  }

  if (!allProjects || allProjects.length === 0) {
    res.json({
      ok: -1,
      message: "No projects found!",
    });
    return;
  }

  res.json({
    ok: 1,
    projects: allProjects.map((project) => project.toObject({ getters: true })),
  });
};

const getProjectById = async (req, res, next) => {
  const pid = req.params.pid;

  let existingProject;
  try {
    existingProject = await Project.findById({_id: pid});
  } catch (err) {
    return res.json({ok:-1, message: "Fetching project failed! "+err})
  }

  if (!existingProject === 0) {
    res.json({
      ok: -1,
      message: "Project does not exist with this ID",
    });
    return;
  }

  res.json({
    ok: 1,
    project: existingProject,
  });
};

const getProjectsByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password');
  } catch (err) {
    return res.json({ ok: -1, message: `Some error occurred: ${err}` });
  }

  let allProjects = []; // Initialize allProjects as an empty array

  for (let id of employee.projects) {
    let project;
    try {
      project = await Project.findOne({ _id: id });
    } catch (err) {
      return res.json({ ok: -1, message: `Some error occurred: ${err}` });
    }
    if (project) {
      allProjects.push(project);
    }
  }

  if (!allProjects || allProjects.length === 0) {
    return res.json({
      ok: -1,
      message: "No projects found!"
    });
  }

  res.json({
    ok: 1,
    message: "Successfully fetched all projects!",
    projects: allProjects.map((project) => project.toObject({ getters: true })),
  });
};

const getCompletedProjectsByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  // const page = req.query.page || 0;
  // const projectsPerPage = 5;

  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password')
  } catch (err) {
    return res.json({ok:-1, message:`Some error occured${err}`});
  }

  let allProjects;
  try {
    allProjects = await Project
      .find({isCompleted: true})
      // .skip(page * projectsPerPage)
      // .limit(projectsPerPage);
  } catch (err) {
    return res.json({
      ok: -1,
      message: "Error in fetching employee projects",
    });
  }

  if (!allProjects || allProjects.length === 0) {
    return res.json({
      ok: 1,
      message: "No projects found!",
      projects: []
    });
  }

  res.json({
    ok: 1,
    projects: allProjects.map((project) => project.toObject({ getters: true })),
  });
};

const getOngoingProjectsByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  // const page = req.query.page || 0;
  // const projectsPerPage = 5;

  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password')
  } catch (err) {
    return res.json({ok:-1, message:`Some error occured${err}`});
  }

  let allProjects;
  try {
    allProjects = await Project
      .find({isCompleted: false})
      // .skip(page * projectsPerPage)
      // .limit(projectsPerPage);
  } catch (err) {
    return res.json({
      ok: -1,
      message: "Error in fetching employee projects",
    });
  }

  if (!allProjects || allProjects.length === 0) {
    return res.json({
      ok: 1,
      message: "No projects found!",
      projects: []
    });
  }

  res.json({
    ok: 1,
    projects: allProjects.map((project) => project.toObject({ getters: true })),
  });
};

const getProjectCount = async (req, res, next) => {
  let projectCount = 0;
  try {
    projectCount = await Project.countDocuments();
  } catch (err) {
    return res.json({ok:-1, message:"Some Error occured in fetching completed projects count!"});
  }

  if (projectCount.length === 0){
    return res.json({ok:1, count:0, message:"No projects found!"})
  }

  res.json({
    ok: 1,
    count: projectCount,
  });
};

const getProjectCountByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  // Checking if the employee exists
  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password')
  } catch (err) {
    return res.json({ok:-1, message:`Some error occured${err}`});
  }

  if (!employee.projects || employee.projects.length === 0) {
    res.json({
      ok: 1,
      message: "No projects found!",
      count: 0
    });
    return;
  }

  res.json({
    ok: 1,
    message: "Successful in fetching project count",
    count: employee.projects.length
  });
};

const getOngoingProjectCountByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password')
  } catch (err) {
    return res.json({ok:-1, message:`Some error occurred: ${err}`});
  }

  if (!employee.projects || employee.projects.length === 0) {
    return res.json({
      ok: 1,
      message: "No projects found!",
      count: 0
    });
  }

  let totalCount = 0;
  for (let pid of employee.projects) {
    try {
      // Find the existing project by projectId
      const existingProject = await Project.findById(pid);
      if (existingProject && !existingProject.isCompleted) {
        totalCount += 1;
      }
    } catch (err) {
      console.error(`Error occurred while fetching project: ${err.message}`);
      return res.json({ ok: -1, message: `Some error occurred: ${err.message}` });
    }
  }

  res.json({
    ok: 1,
    message: "Successful in fetching ongoing project count",
    count: totalCount
  });
};

const getCompletedProjectCountByEmployeeId = async (req, res, next) => {
  const userId = req.params.uid;

  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true }, '-password')
  } catch (err) {
    return res.json({ok:-1, message:`Some error occurred: ${err}`});
  }

  if (!employee.projects || employee.projects.length === 0) {
    return res.json({
      ok: 1,
      message: "No projects found!",
      count: 0
    });
  }

  let totalCount = 0;
  for (let pid of employee.projects) {
    try {
      // Find the existing project by projectId
      const existingProject = await Project.findById(pid);
      if (existingProject && existingProject.isCompleted) {
        totalCount += 1;
      }
    } catch (err) {
      console.error(`Error occurred while fetching project: ${err.message}`);
      return res.json({ ok: -1, message: `Some error occurred: ${err.message}` });
    }
  }

  res.json({
    ok: 1,
    message: "Successful in fetching completed project count",
    count: totalCount
  });
};

const getProjectsCompletedCount = async (req, res, next) => {
  let projectsCount;
  try {
    projectsCount = await Project.countDocuments({isCompleted: true});
  } catch (err) {
    return res.json({ok:-1, message:"Some Error occured in fetching completed projects count!"});
  }
  res.json({ok:1, count: projectsCount});
};

const getProjectsOngoingCount = async (req, res, next) => {
  let projectsCount;
  try {
    projectsCount = await Project.countDocuments({isCompleted: false});
  } catch (err) {
    return res.json({ok:-1, message:"Some Error occured in fetching completed projects count!"});
  }
  res.json({ok:1, count: projectsCount});
};

// POST

const createProject = async (req, res, next) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  // const { title, description } = req.body;
  const { title, description, employees, link, domain, startDate, endDate } = req.body;

  // checking the existance of the domain
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }

  // Creating a new project
  let createdProject
  try {
    // const startingDate = startDate.substring(0,10);
    // const startingDate = startDate.split('T')[0];
    // const endingDate = endDate.substring(0,10);
    createdProject = new Project({
      title: title,
      description: description,
      employees: [],
      link: link,
      domain: existingDomain,
      date_start: startDate,
      date_end: endDate
    });
    await createdProject.save();
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured while saving created project: ",err});
  }

  // Linking the SRS file to the project
  try {
    createdProject.srs = req.file.path;
    await createdProject.save();
  }
  catch (err2){
    console.log("File path error:\n",err2);
  }

  // if employees list is empty
  if (employees.length === 0){
    return res.json({ok:1, project: createdProject, message: "Project creation successful but with no employees!"});
  }
  
  // Iterate over all employee IDs and save it if they exist
  let allValidEmployees = [];
  for (let empId of employees) {
    // Checking the existance of the emp ID
    let existingUser;
    try {
      existingUser = await User.findOne({ _id: empId, isEmployee: true });
      // console.log(empId,"is valid");
      if (!existingUser) {
        continue; // Skip this user if they do not exist
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      console.error('Error finding user with ID: ', empId, ", ERROR: ", error);
      continue;
    }

    // Pushing the ID to the allValidEmployees Array
    try {
      allValidEmployees.push(empId);
    } catch (error) {
      console.error('Error adding employee ID: ', empID,", ERROR: ", error);
    }
  }

  try {
    createdProject.employees = allValidEmployees;
    await createdProject.save();
    return res.status(201).json({ok:1, project: createdProject});
  } catch (err) {
    console.error("Error saving project with updated valid employees:", err);
    return res.json({ok:-1, message: "ERROR saving project with the updated valid employees: ", err});
  }
}

// PATCH

// updates project, req.params provides the id
const updateProjectInfo = async (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  console.log(req.body);
  const { title, description, domain, link, startDate, endDate } = req.body;

  const projectId = req.params.pid;

  // Find the existing project by projectId
  const existingProject = await Project.findById({ _id: projectId });
  if (!existingProject) {
    return res.json({ok:-1, message: `Project ID is invalid` });
  }

  // checking the existance of the domain
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }
  
  // Update project details
  try {
    existingProject.title = title;
    existingProject.domain = existingDomain;
    existingProject.description = description;
    existingProject.link = link;
    existingProject.date_start = startDate,
    existingProject.date_end = endDate
    // Save the updated user
    await existingProject.save();
    return res
      .status(200)
      .json({ 
        ok:1, 
        message: "Successfully updated the project INFO", 
        project: existingProject.toObject({ getters: true }) 
      });
  } catch (err) {
    return res.status(200).json({ ok:-1, message: `Same error occured while updating project INFO, ${err}` });
  }
}

const addProjectMembersById = async (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  // const { title, description } = req.body;
  const { employees } = req.body;
  const pid = req.params.pid;

  // Creating a new project
  let existingProject
  try {
    existingProject = await Project.findOne({ _id: pid });
    if (!existingProject){
      res.json({ok:-1, message: "Project ID is INVALID!"});
    }
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured while dinsing project: ",err});
  }

  // if employees list is empty
  if (employees.length === 0){
    return res.json({ok:1, project: existingProject, message: "Project edit successful but added no employees!"});
  }
  
  // Iterate over all employee IDs and save it if they exist
  let allValidEmployees = [];
  for (let empId of employees) {
    // Checking the existance of the emp ID
    let existingUser;
    try {
      existingUser = await User.findOne({ _id: empId, isEmployee: true });
      // console.log(empId,"is valid");
      if (!existingUser) {
        continue; // Skip this user if they do not exist
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      console.error('Error finding user with ID: ', empId, ", ERROR: ", error);
      continue;
    }

    try {
      // Check if existingProject already exists in existingUser.projects
      const projectExists = existingUser.projects.find(project => project.toString() === pid);  
      if (projectExists) {
        console.error(`The project with ID: ${pid} is already added to the user`);
      } 
      // Push existingProject into existingUser.projects if it doesn't exist
      else {
        existingUser.projects.push(existingProject);
        existingUser.save();
      }
    } catch (err) {
      console.error(`Error occurred while adding project to user: ${err.message}`);
    }
  

    // Pushing the ID to the allValidEmployees Array
    try {
      allValidEmployees.push(empId);
    } catch (error) {
      console.error('Error adding employee ID: ', empID,", ERROR: ", error);
    }
  }

  try {
    existingProject.employees = allValidEmployees;
    await existingProject.save();
    return res.status(201).json({ok:1, project: existingProject, message: "Successfully added employeeID to this existing project"});
  } catch (err) {
    console.error("Error saving project with updated valid employees:", err);
    return res.json({ok:-1, message: "ERROR saving project with the updated valid employees: ", err});
  }
}

const addProjectMembersByEmail = async (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  // const { title, description } = req.body;
  const { employees } = req.body;
  const pid = req.params.pid;

  // Creating a new project
  let existingProject
  try {
    existingProject = await Project.findOne({ _id: pid });
    if (!existingProject){
      res.json({ok:-1, message: "Project ID is INVALID!"});
    }
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured while dinsing project: ",err});
  }

  // if employees list is empty
  if (employees.length === 0){
    return res.json({ok:1, project: existingProject, message: "Project edit successful but added no employees!"});
  }
  
  // Iterate over all employee IDs and save it if they exist
  let allValidEmployees = [];
  for (let email of employees) {
    // Checking the existance of the emp ID
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email, isEmployee: true });
      // console.log(email,"is valid");
      if (!existingUser) {
        continue; // Skip this user if they do not exist
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      console.error('Error finding user with ID: ', email, ", ERROR: ", error);
      continue;
    }

    // Adding the project to the existing user
    let userHasProject;
    try {
      existingUser.projects.push(existingProject);
      existingUser.save();
    } catch (err) {
      console.error(`The employee with email: ${email} is already added to the project`)
    }

    // Pushing the ID to the allValidEmployees Array
    try {
      allValidEmployees.push(email);
    } catch (error) {
      console.error('Error adding employee ID: ', email,", ERROR: ", error);
    }
  }

  try {
    existingProject.employees = allValidEmployees;
    await existingProject.save();
    return res.status(201).json({ok:1, project: existingProject, message: "Successfully added employeeID to this existing project"});
  } catch (err) {
    console.error("Error saving project with updated valid employees:", err);
    return res.json({ok:-1, message: "ERROR saving project with the updated valid employees: ", err});
  }
}

// DELETE

const deleteProject = async (req, res, next) => {
  const { projectId } = req.body;
	let project;
  try {
    // project = await Project.findById(req.params.pid);
    project = await Project.findById(projectId);
  } catch (err) {
    res.status(200).json({ok:-1, message: `Invalid project ID: ${err}` });
  }

  if (!project) {
    res.status(200).json({ok:-1, message: 'Project could not be fetched' });
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
    res.json({ok:-1, message: 'Could not delete prodduct' });
  }

  res.status(200).json({ok:1, message: 'Deleted project.' });
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectsByEmployeeId,
  getCompletedProjectsByEmployeeId,
  getOngoingProjectsByEmployeeId,

  getProjectCount,
  getProjectsCompletedCount,
  getProjectsOngoingCount,
  getProjectCountByEmployeeId,
  getOngoingProjectCountByEmployeeId,
  getCompletedProjectCountByEmployeeId,

  createProject,
  updateProjectInfo,
  addProjectMembersById,
  addProjectMembersByEmail,
  deleteProject
};
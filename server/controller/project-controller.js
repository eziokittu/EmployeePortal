const { validationResult } = require('express-validator');

const { v4: uuidv4 } = require('uuid');
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

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description } = req.body;

    const generatedProjectId = uuidv4();

    const createdProject = new Project({
      projectId: generatedProjectId,
      title: title,
      description: description,
      date_start: Date.now()
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

const deleteProduct = async (req, res, next) => {
	const productId = req.params.pid;

	let product;
  try {
    product = await Product.findById(productId).populate('creator');;
  } catch (err) {
    const error = new HttpError(
      'Something went wrong[3], could not find product to delete. [1]',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.', 404);
    return next(error);
  }

  if (product.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this product.',
      401
    );
    return next(error);
  }

  const imagePath = product.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await product.remove({ session: sess });
    // product.creator.products.pull(product);
    // await product.creator.save({ session: sess });
    // await sess.commitTransaction();

    await product.remove();
    product.creator.products.pull(product);
    await product.creator.save();
  } 
  catch (err) {
    const error = new HttpError(
      'Something went wrong[4], could not delete product.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted product.' });
};

const addEmployee = async(req, res, next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { userId, projectId } = req.body;

    // Find the existing project by projectId
    const existingProject = await Project.findOne({ projectId: projectId });
    if (!existingProject) {
      return next(new HttpError('Project not found, update failed.', 404));
    }
    
    // Update project details
    existingProject.employees = title;
    existingProject.description = description;

    // Save the updated user
    await existingProject.save();
  } 
  catch (err) {
    console.error(err); // Log the error for debugging
    return next(new HttpError('Creating project failed!, please try again later.', 500));
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProjectInfo
  // addEmployee
};
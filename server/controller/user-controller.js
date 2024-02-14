const { validationResult } = require('express-validator');

const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

// GET

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const getUser = async (req, res, next) => {
  const userName = req.params['uid'];
  // console.log('DEBUG -- user-controller.js -- 1: '+uid);
  let user;
  try {
    // user = await User.find();
    user = await User.findOne({userName: userName});
    // console.log('DEBUG -- user-controller.js -- 2: '+user.name);
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({user: user});
};

const getEmployeeCount = async (req, res, next) => {
  let employeeCount;
  try {
    employeeCount = await User.countDocuments({ isEmployee: true });
  } catch (err) {
    const error = new HttpError(
      'Fetching employee count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ employeeCount });
  // console.log("DEBUG -- Employee-Controller - Fetching employee count successful!");
};

const getEmployees = async (req, res, next) => {
  const page = req.query.page || 0;
  const employeesPerPage = 3;

  let allEmployees;
  try {
    allEmployees = await User
      .find({ isEmployee: true })  // Adjust the query to filter by isEmployee
      .skip(page * employeesPerPage)
      .limit(employeesPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching Employees failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allEmployees || allEmployees.length === 0) {
    return next(new HttpError('No employees found.', 404));
  }

  res.json({
    employees: allEmployees.map((emp) => emp.toObject({ getters: true })),
  });
  // console.log("DEBUG -- Employee-Controller - Fetching employees successful!");
};

const getEmployee = async (req, res, next) => {
  const userId = req.params['uid'];
  // console.log(userId);
  let employee;
  try {
    employee = await User.findById({ _id: userId })
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    // console.log(error);
    return next(error);
  }

  // if (employee.isEmployee == false){
  //   const error = new HttpError(
  //     'User is not an employee.',
  //     422
  //   );
  //   return next(error);
  // }

  res.json({employee: employee});
};

// POST

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { firstname, lastname, email, password } = req.body;

    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(new HttpError('User exists already, please login instead.', 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const generatedUserName = uuidv4();

    const createdUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      userName: generatedUserName,
    });

    await createdUser.save();

    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '15min' }
    );

    res.status(201).json({
      userId: createdUser.id,
      userName: createdUser.userName,
      email: createdUser.email,
      token: token,
      isEmployee: createdUser.isEmployee,
      isAdmin: createdUser.isAdmin,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.DB_USER,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    userName: existingUser.userName,
    email: existingUser.email,
    token: token,
    isEmployee: existingUser.isEmployee,
    isAdmin: existingUser.isAdmin
  });
};

// PATCH 

const updateUserInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { firstname, lastname, userName, email, phone, bio } = req.body;

  const userId = req.params.uid;

  try {
    // Find the existing user by email
    const existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      return next(new HttpError('User not found, update failed.', 404));
    }

    // Check if the updated userName already exists
    if (userName !== existingUser.userName) {
      const userWithSameId = await User.findOne({ userName });
      if (userWithSameId) {
        return next(new HttpError('The entered username is taken. Try something else.', 422));
      }
    }

    // const hashedPassword = await bcrypt.hash(password, 12);
    
    // Update user details
    existingUser.firstname = firstname;
    existingUser.lastname = lastname;
    existingUser.userName = userName;
    existingUser.phone = phone;
    existingUser.bio = bio;

    // Save the updated user
    await existingUser.save();
    
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return next(new HttpError('Something went wrong[1], could not update user.', 500));
  }
};

const updateUserPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { oldPassword, newPassword } = req.body;
  const userId = req.params.uid;

  let existingUser;
  try {
    existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      return next(new HttpError('User not found, update failed.', 404));
    }
  }
  catch (error) {
    return new HttpError("Something went wrong!", 404);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, existingUser.password);
  } catch (err) {
    return new HttpError('Some error occured!',500);
  }

  if (!isValidPassword) {
    return next(new HttpError('The passwords dont match', 500));
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return next(new HttpError('Something went wrong[1], could not update user password.', 500));
  }
};

const updateUserImage = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    // Find the existing user by email
    const existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      return next(new HttpError('User not found, update failed.', 404));
    }

    try {
      existingUser.image = req.file.path;
      // console.log(req.file.path);
    }
    catch (err2){
      console.log("File path error:\n",err2);
    }

    // Save the updated user
    await existingUser.save();
    
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return next(new HttpError('Something went wrong[1], could not update user image.', 500));
  }
};

const removeUserImage = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    // Find the existing user by email
    const existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      return next(new HttpError('User not found, update failed.', 404));
    }

    const imagePath = existingUser.image;
    fs.unlink(imagePath, err => {
      console.log("Successfully deleted the image file for the user");
    })
    existingUser.image = process.env.DB_USER_DEFAULT_IMAGE;

    await existingUser.save();
    
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return next(new HttpError('Something went wrong[1], could not update user image.', 500));
  }
};

const updateUserAsEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userName } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ userName: userName });
    existingUser.isEmployee = true;
    await existingUser.save();
      
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      'UserName does not exist, please try again later.',
      500
    );
    return next(error);
  }
};

const updateEmployeeAsUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userName } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ userName: userName });
    existingUser.isEmployee = false;
    await existingUser.save();
      
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      'UserName does not exist, please try again later.',
      500
    );
    return next(error);
  }
};

// DELETE

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let existingUser;
  try {
    existingUser = await User.findById({_id: userId});
  } catch (err) {
    return new HttpError('Something went wrong, could not find user',500);
  }
  // console.log(req);
  // if (userId !== req.userData.userId) {
  //   return new HttpError(`You are not allowed to delete this user, ERROR: ${req.userData}`,401);
  // }

  const imagePath = existingUser.image;

  const password = req.body.password;
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return new HttpError('Could not match the passwords',500);
  }

  if (!isValidPassword) {
    return new HttpError('Could not delete Account! Passwords do not match',500);
  }
  // console.log("GG");
  try {
    await User.deleteOne(existingUser);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  if (imagePath !== process.env.DB_USER_DEFAULT_IMAGE){
    fs.unlink(imagePath, err => {
      console.log("Successfully deleted the image file for the user");
    })
  };

  res.status(200).json({ message: 'Deleted user.' });
};

module.exports = {
  getEmployeeCount,
  getEmployees,
  getEmployee,
	getUsers,
  getUser,
	signup,
	login,
  updateUserInfo,
  updateUserPassword,
  updateUserImage,
  removeUserImage,
  updateEmployeeAsUser,
  updateUserAsEmployee,
  deleteUser
};
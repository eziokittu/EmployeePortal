const { validationResult } = require('express-validator');

const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Project = require('../models/project');
const Role = require('../models/role');

// GET

const getUsers = async (req, res, next) => {
  const page = req.query.page || 0;
  const usersPerPage = 10;
  let users;
  try {
    users = await User
      .find({}, '-password')
      .skip(page * usersPerPage)
      .limit(usersPerPage);
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
    user = await User.findOne({userName: userName}, '-password');
    // console.log('DEBUG -- user-controller.js -- 2: '+user.name);
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ok:1, user: user});
};

const getUserById = async (req, res, next) => {
  const userId = req.params['uid'];
  // console.log(userId);
  let user;
  try {
    user = await User.findById({ _id: userId }, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    // console.log(error);
    return next(error);
  }

  res.json({ok:1, user: user});
};

const getUserByEmail = async (req, res, next) => {
  const email = req.params['email'];
  let user;
  try {
    user = await User.find({ email: email }, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({user: user});
};

const getUserByUsername = async (req, res, next) => {
  const username = req.params['username'];
  let user;
  try {
    user = await User.find({ userName: username }, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({user: user});
};

const getEmployeesByProjectId = async (req, res, next) => {
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

  // Iterate over all user IDs
  let existingEmployees = [];
  for (let uid of existingProject.employees) {

    // Finding the existance of the user with USER ID
    let existingUser;
    try {
      existingUser = await User.findOne({ _id: uid, isEmployee: true, isAdmin: false });
      if (!existingUser) {
        continue; // Skip this user if they do not exist
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      console.error('Error finding user with ID:', uid, error);
      continue;
    }

    existingEmployees.push(existingUser);
  }

  // Respond with all the approved applications
  if (existingEmployees.length > 0) {
    res.json({ ok: 1, employees: existingEmployees, message:"Fetching employees successful" });
  } else {
    // If no applications were approved, send a different response
    res.json({ ok: -1, message: 'No employees' });
  }
};

const getEmployeeCount = async (req, res, next) => {
  let employeeCount;
  try {
    employeeCount = await User.countDocuments({ isEmployee: true, isTerminated: false  });
  } catch (err) {
    res.json({ ok:-1, message:"No Employees found" });
    return;
  }

  res.json({ ok:1, count: employeeCount });
  // console.log("DEBUG -- Employee-Controller - Fetching employee count successful!");
};

const getEmployees = async (req, res, next) => {
  const page = req.query.page || 0;
  const employeesPerPage = 5;

  let allEmployees;
  try {
    allEmployees = await User
      .find({ isEmployee: true, isTerminated: false }, '-password')  // Adjust the query to filter by isEmployee
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
    res.json({
      ok: -1,
      message: "No employees found.",
    });
    return;
  }

  res.json({
    ok: 1,
    employees: allEmployees.map((emp) => emp.toObject({ getters: true })),
  });
  // console.log("DEBUG -- Employee-Controller - Fetching employees successful!");
};

const getEmployeeById = async (req, res, next) => {
  const userId = req.params['uid'];
  let employee;
  try {
    employee = await User.findOne({ _id: userId, isEmployee: true, isTerminated: false }, '-password')
    if (!employee){
      return res.json({ok:-1, message:"Employee does not exist with userId: "+userId})
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching employee failed"});
  }

  res.json({ok:1, employee: employee});
};

const getEmployeeByEmail = async (req, res, next) => {
  const email = req.params['email'];
  let employee;
  try {
    employee = await User.findOne({ email: email, isEmployee: true, isTerminated: false }, '-password')
    if (!employee){
      return res.json({ok:-1, message:"Employee does not exist with email: "+email})
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({employee: employee});
};

const getEmployeeByRef = async (req, res, next) => {
  const ref = req.params['ref'];
  let employee;
  try {
    employee = await User.findOne({ ref: ref, isEmployee: true, isTerminated: false }, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({employee: employee});
};

const getEmployeeByUsername = async (req, res, next) => {
  const username = req.params['username'];
  let employee;
  try {
    employee = await User.findOne({ userName: username, isEmployee: true }, '-password')
    if (!employee){
      return res.json({ok:-1, message:"Employee does not exist with username: "+username})
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching Employee failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({employee: employee});
};

const searchEmployeeByEmail = async (req, res, next) => {
  const search_email = req.params['search_email'];

  let employee;
  try {
    // Use a regular expression to search for a user with an email that includes the searchQuery
    // 'i' flag for case-insensitive search
    employee = await User.findOne({ email: new RegExp(search_email, 'i'), isEmployee: true, isTerminated: false }, '-password');

    if (!employee) {
      return res.status(404).json({ ok:-1, message: 'No employee found matching the email query.' });
    }

  } catch (err) {
    return res.json({ ok:-1, message: "Something went wrong!",err });
  }

  res.json({ ok:1, employee: employee });
};

const searchEmployeeByRef = async (req, res, next) => {
  // Get the modified ref ID from request params
  const modifiedRef = req.params['search_ref'];

  // Convert ":" back to "/" to restore the original ref ID format
  const originalRef = modifiedRef.replace(/:/g, '/');

  let employee;
  try {
    employee = await User.findOne({ ref: new RegExp(originalRef, 'i'), isEmployee: true, isTerminated: false }, '-password');

    if (!employee) {
      return res.status(404).json({ ok:-1, message: 'No employee found matching the reference ID query.' });
    }
  } catch (err) {
    return res.json({ ok:-1, message: "Something went wrong!",err });
  }

  res.json({ ok:1, employee: employee, message: "Successfully fetched the user with this referecne ID" });
};


const getAllTerminations = async (req, res, next) => {
  const page = req.query.page || 0;
  const terminationsPerPage = 2;

  let terminations;
  try {
    terminations = await User
      .find({isTerminated: true})
      .skip(page * terminationsPerPage)
      .limit(terminationsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching terminations failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!terminations || terminations.length === 0) {
    return next(new HttpError('No terminations found.', 404));
  }

  res.json({terminations: terminations.map(termination => termination.toObject({ getters: true }))});
};

const getAllTerminationsCount = async (req, res, next) => {
  let terminationCount;
  try {
    terminationCount = await User.find({isTerminated: true}).countDocuments();
  } catch (err) {
    const error = new HttpError(
      'Fetching termination count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({count: terminationCount });
};

const getTerminationStatusById = async (req, res, next) => {
  const userId = req.params.uid;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "The user does not exist with this ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  res.status(200).json({ status: existingUser.isTerminated });
};

const getTerminationStatusByEmail = async (req, res, next) => {
  const email = req.params.email;

  let existingUser;
  try {
    existingUser = await User.findOne({email: email, isEmployee: true});
    if (!existingUser) {
      return next(new HttpError('Employee does not exist with this email', 422));
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  res.status(200).json({ status: existingUser.isTerminated });
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
      return res.json({ok:-1, message: "User already exists with this email!. Please log in!"})
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

      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      email: createdUser.email,
      bio: createdUser.bio,
      role: createdUser.role,
      phone: createdUser.phone,
      image: createdUser.image
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.json({ok:-1, message: "Signup failed! Try again later!"})
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.json({ok:-1, message: "Something went wrong while searching the email!"})
  }

  if (!existingUser) {
    
    return res.json({ok:-1, message: "Invalid email! No user exists with this email!"})
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.json({ok:-1, message: "Something went wrong while checking password!"})
  }

  if (!isValidPassword) {
    return res.json({ok:-1, message: "Invalid password! Could not log in!"})
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.DB_USER,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return res.json({ok:-1, message: "Logging in failed, please try again later."})
  }

  res.status(201).json({
    ok: 1,
    userId: existingUser.id,
    userName: existingUser.userName,
    email: existingUser.email,
    token: token,
    isEmployee: existingUser.isEmployee,
    isAdmin: existingUser.isAdmin,

    firstname: existingUser.firstname,
    lastname: existingUser.lastname,
    email: existingUser.email,
    bio: existingUser.bio,
    role: existingUser.role,
    phone: existingUser.phone,
    image: existingUser.image
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

  let existingUser;
  try {
    // Find the existing user by email
    existingUser = await User.findById({ _id: userId });
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
      return res.json({ok:-1, message: "User does not exist with this user ID"});
    }
  }
  catch (error) {
    return new HttpError("Something went wrong!", 404);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, existingUser.password);
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured while comparing passwords!"});
  }

  if (!isValidPassword) {
    return res.json({ok:-1, message: "The old password does not match!"});
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.json({ ok:1, message:"updated password", user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return res.json({ok:-1, message: "Something went wrong, could not update user password!"});
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

    // Unlinking the user image file
    const imagePath = existingUser.image;
    if (imagePath !== process.env.DB_USER_DEFAULT_IMAGE){
      fs.unlink(imagePath, err => {
        console.log("Successfully deleted the image file for the user with ID:", userId);
      })
    }
    
    // Linking the new image
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

    // Unlinking the user image file
    const imagePath = existingUser.image;
    if (imagePath !== process.env.DB_USER_DEFAULT_IMAGE){
      fs.unlink(imagePath, err => {
        console.log("Successfully deleted the image file for the user with ID:", userId);
      })
    }
    // Removing the file path from database
    existingUser.image = process.env.DB_USER_DEFAULT_IMAGE;

    // Save the updated user
    await existingUser.save();
    
    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    // Handle database or server errors
    return next(new HttpError('Something went wrong[1], could not update user image.', 500));
  }
};

const updateUserAsEmployee = async (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { userId } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById({_id: userId});
    existingUser.isEmployee = true;
    await existingUser.save();
      
    res.status(200).json({ok:1,  user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      'userId does not exist, please try again later.',
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

  const { userId } = req.body;

  let existingUser;
  try {
    existingUser = await User.find({ _id: userId });
    existingUser.isEmployee = false;
    await existingUser.save();
      
    res.status(200).json({ok: 1, user: existingUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      'UserId does not exist, please try again later.',
      500
    );
    return next(error);
  }
};

const updateEmployeeRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const empId = req.params.empId;
  const { role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ _id: empId, isEmployee: true });
  } catch (err) {
    return res.json({ok:-1, message: "Invalid Employee ID!"})
  }

  try {
    existingUser.role = role;
    existingUser.save();
    return res.json({ok:1, message: "Updated employee Role", role:existingUser.role})
  } catch (err) {
    return res.json({ok:-1, message: "Error in updating employee role"})
  }
};

const terminateEmployeeByEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ok:-1 , message: "invalid inputs passed!"});
  }

  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email: email, isEmployee: true });
    if (!existingUser) {
      return res.json({ok:-1, message: "Could not find Employee with this email!"});
    }

    existingUser.isTerminated = true;
    // existingUser.isEmployee = false;
    // existingUser.ref = '-';
    await existingUser.save();

    return res.json({ok:1, message: `Employee with email: ${email} has been terminated!`})
    res.status(201).send(`Employee with email: ${email} has been terminated!`);
  } catch (error) {
    return res.json({ok:-1, message: "Could not terminate employee with this email!"})
  }
}

const unterminateEmployeeByEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send('Invalid inputs passed, please check your data.');
  }

  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email: email, isEmployee: true });
    if (!existingUser) {
      return res.status(500).send("Could not find Employee with this email!");
    }

    // Set isTerminated back to true to un-terminate the employee
    existingUser.isTerminated = false;
    existingUser.isEmployee = false
    await existingUser.save();

    res.status(200).send(`Employee with email: ${email} has been reinstated!`);
  } catch (error) {
    return res.status(500).send("Could not reinstate employee");
  }
}

const giveRating = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { rating, userId } = req.body;

  let existingUser;
  try {
    // Find the existing user by email
    existingUser = await User.findById({ _id: userId, isEmployee: true }, '-password');
    if (!existingUser) {
      return next(new HttpError('User not found, update failed.', 404));
    }
  } catch (err) {
    return res.json({ok:-1, message:"The user ID is invalid!"+err})
  }

  // Checking if rating is in range
  let finalRating = rating;
  if (rating>5){
    finalRating = 5;
  }
  else if (rating<0){
    finalRating = 0;
  }

  // Updating the user's rating
  try {
    existingUser.rating = finalRating;
    existingUser.save();
  } catch (err) {
    return res.json({ok:-1, message: "saving the existing user failed!"+err})
  }

  return res.json({ok:1, message: "Successfully updated employee rating"})
}

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
  getEmployeeById,
  getEmployeeByEmail,
  getEmployeeByUsername,
  getEmployeeByRef,
  searchEmployeeByEmail,
  searchEmployeeByRef,
  
  getAllTerminations,
  getAllTerminationsCount,
  getTerminationStatusById,
  getTerminationStatusByEmail,

	getUsers,
  getUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getEmployeesByProjectId,

	signup,
	login,

  updateUserInfo,
  updateUserPassword,
  updateUserImage,
  removeUserImage,
  updateEmployeeRole,
  updateEmployeeAsUser,
  updateUserAsEmployee,
  giveRating,

  terminateEmployeeByEmail,
  unterminateEmployeeByEmail,
  
  deleteUser
};
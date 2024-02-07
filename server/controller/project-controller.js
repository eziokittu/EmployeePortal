// const { validationResult } = require('express-validator');

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');
// const HttpError = require('../models/http-error');
// const User = require('../models/user');

// const getUsers = async (req, res, next) => {
//   let users;
//   try {
//     users = await User.find({}, '-password');
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching users failed, please try again later.',
//       500
//     );
//     return next(error);
//   }
//   res.json({users: users.map(user => user.toObject({ getters: true }))});
// };

// const getUser = async (req, res, next) => {
//   const uid = req.params['uid'];
//   console.log('DEBUG -- user-controller.js -- 1: '+uid);
//   let user;
//   try {
//     // user = await User.find();
//     user = await User.findById(uid);
//     console.log('DEBUG -- user-controller.js -- 2: '+user.name);
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching user failed, please try again later.',
//       500
//     );
//     return next(error);
//   }
//   res.json({user: user});
// };

// const getEmployeeCount = async (req, res, next) => {
//   let employeeCount;
//   try {
//     employeeCount = await User.countDocuments({ isEmployee: true });
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching employee count failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   res.json({ employeeCount });
//   console.log("DEBUG -- Employee-Controller - Fetching employee count successful!");
// };

// const getEmployees = async (req, res, next) => {
//   const page = req.query.page || 0;
//   const employeesPerPage = 2;

//   let allEmployees;
//   try {
//     allEmployees = await User
//       .find({ isEmployee: true })  // Adjust the query to filter by isEmployee
//       .skip(page * employeesPerPage)
//       .limit(employeesPerPage);
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching Employees failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   if (!allEmployees || allEmployees.length === 0) {
//     return next(new HttpError('No employees found.', 404));
//   }

//   res.json({
//     employees: allEmployees.map((emp) => emp.toObject({ getters: true })),
//   });
//   console.log("DEBUG -- Employee-Controller - Fetching employees successful!");
// };

// // Utility Function to generate user id in format
// // const generateFormattedUserId = (date, userNumber) => {
// //   const year = date.getFullYear().toString().slice(2);
// //   const month = padNumber(date.getMonth() + 1);
// //   const day = padNumber(date.getDate());
// //   // const hours = padNumber(date.getHours());
// //   // const minutes = padNumber(date.getMinutes());

// //   // atmost 99999 unique userIDs possible in 1 hour span XD (a lot though)
// //   return `${year}${month}${day}${padNumber(userNumber, 5)}`;
// // };

// // Utility function
// // const padNumber = (num, length = 2) => {
// //   return num.toString().padStart(length, '0');
// // };

// const signup = async (req, res, next) => {
//   const errors = validationResult(req);
//   // console.log(errors);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const { firstname, lastname, email, password } = req.body;

//   let existingUser;
//   try {
//     existingUser = await User.findOne({ email: email });
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again later.',
//       500
//     );
//     console.log("ERROR 500 [In Database Access assign Read/write roles to your user]\n ",err);
//     return next(error);
//   }

//   if (existingUser) {
//     const error = new HttpError(
//       'User exists already, please login instead.',
//       422
//     );
//     return next(error);
//   }

//   let hashedPassword;
//   try {
//     hashedPassword = await bcrypt.hash(password, 12);
//   } catch (err) {
//     const error = new HttpError(
//       'Could not create user, please try again.',
//       500
//     );
//     return next(error);
//   }

//   // const currentDate = new Date();
//   // const userNumber = await User.countDocuments({
//   //   createdAt: {
//   //     $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
//   //     $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
//   //   },
//   // }) + 1;
//   // const formattedUserId = generateFormattedUserId(currentDate, userNumber);

//   const generatedUserId = uuidv4();

//   const createdUser = new User({
//     firstname,
//     lastname,
//     email,
//     password: hashedPassword,
//     userId: generatedUserId
//   });

//   try {
//     await createdUser.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again.',
//       500
//     );
//     return next(error);
//   }

//   let token;
//   try {
//     token = jwt.sign(
//       { userId: createdUser.id, email: createdUser.email },
//       'supersecret_dont_share',
//       { expiresIn: '15min' }
//     );
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   res
//     .status(201)
//     .json({
//       userId: createdUser.id,
//       email: createdUser.email,
//       token: token
//     });
// };

// const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   let existingUser;

//   try {
//     existingUser = await User.findOne({ email: email });
//   } catch (err) {
//     const error = new HttpError(
//       'Logging in failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   if (!existingUser) {
//     const error = new HttpError(
//       'Invalid credentials, could not log you in.',
//       403
//     );
//     return next(error);
//   }

//   let isValidPassword = false;
//   try {
//     isValidPassword = await bcrypt.compare(password, existingUser.password);
//   } catch (err) {
//     const error = new HttpError(
//       'Could not log you in, please check your credentials and try again.',
//       500
//     );
//     return next(error);
//   }

//   if (!isValidPassword) {
//     const error = new HttpError(
//       'Invalid credentials, could not log you in.',
//       403
//     );
//     return next(error);
//   }

//   let token;
//   try {
//     token = jwt.sign(
//       { userId: existingUser.id, email: existingUser.email },
//       'supersecret_dont_share',
//       { expiresIn: '1h' }
//     );
//   } catch (err) {
//     const error = new HttpError(
//       'Logging in failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   res.json({
//     userId: existingUser.id,
//     email: existingUser.email,
//     token: token
//   });
// };

// module.exports = {
//   getEmployeeCount,
//   getEmployees,
// 	getUsers,
//   getUser,
// 	signup,
// 	login
// };
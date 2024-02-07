const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Offer = require('../models/offer');
const User = require('../models/user');

const getOffers = async (req, res, next) => {
  const page = req.query.page || 0;
  const offersPerPage = 2;
  // const { type } = req.body;

  let allOffers;
  try {
    allOffers = await Offer
      // .find({type: type})
      .find()
      .skip(page * offersPerPage)
      .limit(offersPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allOffers || allOffers.length === 0) {
    return next(new HttpError('No offers found.', 404));
  }

  res.json({
    offers: allOffers.map((offer) => offer.toObject({ getters: true })),
  });
  console.log("DEBUG -- Offer-Controller - Fetching offers successful!");
};

const getInternships = async (req, res, next) => {
  const page = req.query.page || 0;
  const internshipsPerPage = 2;

  let allOffers;
  try {
    allOffers = await Offer
      .find({type: 'Internship'})
      .skip(page * internshipsPerPage)
      .limit(internshipsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allOffers || allOffers.length === 0) {
    return next(new HttpError('No internships found.', 404));
  }

  res.json({
    offers: allOffers.map((offer) => offer.toObject({ getters: true })),
  });
  console.log("DEBUG -- Offer-Controller - Fetching internships successful!");
};

const getJobs = async (req, res, next) => {
  const page = req.query.page || 0;
  const jobsPerPage = 2;

  let allOffers;
  try {
    allOffers = await Offer
      .find({type: 'Job'})
      .skip(page * jobsPerPage)
      .limit(jobsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allOffers || allOffers.length === 0) {
    return next(new HttpError('No internships found.', 404));
  }

  res.json({
    offers: allOffers.map((offer) => offer.toObject({ getters: true })),
  });
  console.log("DEBUG -- Offer-Controller - Fetching internships successful!");
};

const getOffer = async (req, res, next) => {
  const oid = req.params['oid'];
  // console.log('DEBUG -- offer-controller.js -- 1: '+uid);
  let offer;
  try {
    // user = await User.find();
    offer = await Offer.findById(oid);
    // console.log('DEBUG -- offer-controller.js -- 2: ');
  } catch (err) {
    const error = new HttpError(
      'Fetching offer with offerId failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({offer: offer});
};

const getOfferCount = async (req, res, next) => {
  let offerCount;
  // const { type } = req.body;
  try {
    offerCount = await Offer.countDocuments();
    // offerCount = await Offer.countDocuments({ type: type });
  } catch (err) {
    const error = new HttpError(
      'Fetching offer count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ offerCount });
  console.log("DEBUG -- Offer-Controller - Fetching offer count successful!");
};

const getInternshipCount = async (req, res, next) => {
  let offerCount;
  const { type } = req.body;
  try {
    // offerCount = await Offer.countDocuments();
    offerCount = await Offer.countDocuments({ type: 'Internship' });
  } catch (err) {
    const error = new HttpError(
      'Fetching job count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ offerCount });
  console.log("DEBUG -- Offer-Controller - Fetching internships count successful!");
};

const getJobCount = async (req, res, next) => {
  let offerCount;
  try {
    // offerCount = await Offer.countDocuments();
    offerCount = await Offer.countDocuments({ type: 'Job' });
  } catch (err) {
    const error = new HttpError(
      'Fetching job count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ offerCount });
  console.log("DEBUG -- Offer-Controller - Fetching job count successful!");
};

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

// Utility Function to generate user id in format
// const generateFormattedUserId = (date, userNumber) => {
//   const year = date.getFullYear().toString().slice(2);
//   const month = padNumber(date.getMonth() + 1);
//   const day = padNumber(date.getDate());
//   // const hours = padNumber(date.getHours());
//   // const minutes = padNumber(date.getMinutes());

//   // atmost 99999 unique userIDs possible in 1 hour span XD (a lot though)
//   return `${year}${month}${day}${padNumber(userNumber, 5)}`;
// };

// Utility function
// const padNumber = (num, length = 2) => {
//   return num.toString().padStart(length, '0');
// };

const createOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { type, heading, link } = req.body;

  const createdOffer = new Offer({
    type,
    heading,
    link
  });

  try {
    await createdOffer.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new Offer failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({offer: createdOffer});
};

// const applyOffer = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const { userId, offerId } = req.body;
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

module.exports = {
  getOffer,
  getOffers,
  getInternships,
  getJobs,
  getOfferCount,
  getInternshipCount,
  getJobCount,
  createOffer
  // applyOffer
};
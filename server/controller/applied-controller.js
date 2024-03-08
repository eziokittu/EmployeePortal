const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Offer = require('../models/offer');
const User = require('../models/user');
const Applied = require('../models/applied');

// GET

const getAppliedInternship = async (req, res, next) => {
  const page = req.query.page || 0;
  const internshipsPerPage = 2;

  let allApplied;
  try {
    allApplied = await Applied
      .find({type: 'internship'})
      .skip(page * internshipsPerPage)
      .limit(internshipsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching Applied failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allApplied || allApplied.length === 0) {
    return next(new HttpError('No Applied users in internships found.', 404));
  }

  res.json({
    applied: allApplied.map((applied) => applied.toObject({ getters: true })),
  });
};

const getAppliedJobs = async (req, res, next) => {
  const page = req.query.page || 0;
  const jobsPerPage = 2;

  let allApplied;
  try {
    allApplied = await Applied
      .find({type: 'job'})
      .skip(page * jobsPerPage)
      .limit(jobsPerPage);
  } catch (err) {
    const error = new HttpError(
      'Fetching Applied failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!allApplied || allApplied.length === 0) {
    return next(new HttpError('No Applied users in jobs found.', 404));
  }

  res.json({
    applied: allApplied.map((applied) => applied.toObject({ getters: true })),
  });
};

const getAppliedInternshipCount = async (req, res, next) => {
  let appliedCount;
  try {
    // appliedCount = await Offer.countDocuments();
    appliedCount = await Applied.countDocuments({ type: 'internship' });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied internship count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: appliedCount });
};

const getAppliedJobCount = async (req, res, next) => {
  let appliedCount;
  try {
    // appliedCount = await Offer.countDocuments();
    appliedCount = await Applied.countDocuments({ type: 'job' });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied user job count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: appliedCount });
};

// POST

const applyOffer = async (req, res, next) => {
  // console.log("Request body: ", req.body);

  // Checking if date passed in correct or not
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { type, link, oid, uid } = req.body;

  try {
    existingUser = await User.findById({_id: uid});
    if (!existingUser) {
      return new HttpError('User does not exist', 422);
    }
  } catch (error) {
    return res.status(400).json({message: 'User not in correct format / INVALID'});
  }

  try {
    existingOffer = await Offer.findById({_id: oid});
    if (!existingOffer) {
      return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.status(400).json({message: 'Offer not in correct format / INVALID'});
  }

  try {
    const existingApplied = await Applied.findOne({ offer: oid, user: uid });
    if (existingApplied !== null) {
      return res.status(201).json({ applied: null, message: "User already applied in this offer" })
    }
  } catch (error) {
    console.error(error);
  }

  if (type!=='job' && type!=='internship'){
    return res.status(400).json({ applied: null, message: "Offer type is INVALID" });
  }

  const newLink = "https://www.google.com";
  const updatedLink = link.length < 4 ? newLink : link;

  const createdApplied = new Applied({
    type: type,
    link: updatedLink,
    offer: oid,
    user: uid
  });

  // Linking the new resume PDF
  // try {
  //   existingUser.resume = req.file.path;
  // }
  // catch (err){
  //   console.log("File path error:\n",err);
  // }

  try {
    await createdApplied.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new Applied failed, please try again.',
      500
    );
    return next(error);
  } 

  res.status(200).json({ applied: createdApplied });
};

// DELETE

// const deleteOffer = async (req, res, next) => {  
//   const offerId = req.params.oid;
//   let existingOffer;
//   try {
//     existingOffer = await Offer.findById({_id: offerId});
//     console.log("working1");
//     if (!existingOffer) {
//       return new HttpError('Offer not found!', 404);
//     }
//     console.log("working2");
//   }
//   catch (error) {
//     return new HttpError('Some error occured while finding an offer', 500);
//   }
//   console.log("working3");
//   try {
//     await Offer.deleteOne(existingOffer);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete offer.',
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({ message: 'Deleted offer.' });
// };

module.exports = {
  getAppliedInternship,
  getAppliedJobs,
  getAppliedInternshipCount,
  getAppliedJobCount,
  applyOffer
};
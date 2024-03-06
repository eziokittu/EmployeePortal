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

const createInternshipOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { stipend, heading, link } = req.body;

  const createdOffer = new Offer({
    type: 'internship',
    stipend: stipend,
    heading: heading,
    link: link
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

const createJobOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { ctc, heading, link } = req.body;

  const createdOffer = new Offer({
    type: 'job',
    ctc: ctc,
    heading: heading,
    link: link
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

// PATCH

const applyOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  
  const { userId, offerId } = req.body;
  let existingOffer;
  try {
    existingOffer = await Offer.findById(offerId);
    if (!existingOffer) {
      throw new Error('Offer not found!');
    }

    existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error('user not found!');
    }
    
    const userAlreadyApplied = existingOffer.users_applied.includes(userId);
    if (!userAlreadyApplied) {
      existingOffer.users_applied.push(userId);
      await existingOffer.save();
    }
  } catch (err) {
    return next(new HttpError('Error applying offer: ' + err.message, 500));
  }

  res.status(201).json({ offer: existingOffer });
};

// DELETE

const deleteOffer = async (req, res, next) => {  
  const offerId = req.params.oid;
  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: offerId});
    console.log("working1");
    if (!existingOffer) {
      return new HttpError('Offer not found!', 404);
    }
    console.log("working2");
  }
  catch (error) {
    return new HttpError('Some error occured while finding an offer', 500);
  }
  console.log("working3");
  try {
    await Offer.deleteOne(existingOffer);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete offer.',
      500
    );
    return next(error);
  }

  res.status(201).json({ message: 'Deleted offer.' });
};

module.exports = {
  getAppliedInternship,
  getAppliedJobs,
  getAppliedInternshipCount,
  getAppliedJobCount

  // createOffer,
  // createInternshipOffer,
  // createJobOffer,
  // deleteOffer,
  // applyOffer
};
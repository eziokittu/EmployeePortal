const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Offer = require('../models/offer');
const User = require('../models/user');
const Applied = require('../models/applied');
const Domain = require('../models/domains');

let uniqueRefIDCounter = 1;

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

const getAppliedUsersInJob = async (req, res, next) => {
  const oid = req.params['oid'];

  let existingOffersCount;
  try {
    // appliedCount = await Offer.countDocuments();
    existingOffersCount = await Applied.countDocuments({ offer: oid, type: 'job' });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied offer count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: existingOffersCount });
};

const getAppliedUsersInInternship = async (req, res, next) => {
  const oid = req.params['oid'];

  let existingOffersCount;
  try {
    // appliedCount = await Offer.countDocuments();
    existingOffersCount = await Applied.countDocuments({ offer: oid, type: 'internship' });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied offer count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: existingOffersCount });
};

const getApprovedUsersInJob = async (req, res, next) => {
  const oid = req.params['oid'];

  let existingOffersCount;
  try {
    // appliedCount = await Offer.countDocuments();
    existingOffersCount = await Applied.countDocuments({ offer: oid, type: 'job', isApproved: true });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied offer count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: existingOffersCount });
};

const getApprovedUsersInInternship = async (req, res, next) => {
  const oid = req.params['oid'];

  let existingOffersCount;
  try {
    // appliedCount = await Offer.countDocuments();
    existingOffersCount = await Applied.countDocuments({ offer: oid, type: 'internship', isApproved: true });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied offer count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ count: existingOffersCount });
};

const checkIfUserAppliedOffer = async (req, res, next) => {
  const oid = req.params['oid'];
  const uid = req.params['uid'];

  try {
    const existingOffer = await Applied.findOne({ offer: oid, user: uid });

    res.json({ check: !!existingOffer }); // Convert to boolean using !!
  } catch (err) {
    const error = new HttpError(
      'Fetching applied offer failed, please try again later.',
      500
    );
    return next(error);
  }
};

const getAppliedWithOfferId= async (req, res, next) => {
  const oid = req.params['oid'];

  // Checking if the offer id is valid
  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: oid});
    if (!existingOffer) {
      return res.json({ ok: -1, message: 'Some error occured in fetching applied'});
      // return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Offer not in correct format / INVALID'});
  }

  const page = req.query.page || 0;
  const applicationsPerPage = 3;

  // Getting all the applied with the same Offer ID
  let allApplied;
  try {
    allApplied = await Applied
      .find({offer: oid})
      .skip(page * applicationsPerPage)
      .limit(applicationsPerPage);
    if (!allApplied) {
      return res.json({ ok: -1, message: 'No one applied to this offer'});
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occured in fetching applied'});
  }

  // If no applications exist for this offer
  if (!allApplied || allApplied.length === 0) {
    return res.json({ ok: -1, message: 'No applications found'});
    // return next(new HttpError('No applications found.', 404));
  }

  // get if this is a job or not
  let isJob = true;
  if (allApplied[0].type !== 'job'){
    isJob = false;
  }

  // sending the response
  res.json({
    ok: 1,
    isJob: isJob,
    applied: allApplied.map((a) => a.toObject({ getters: true })),
  });
};

const getAppliedCountWithOfferId= async (req, res, next) => {
  const oid = req.params['oid'];

  // Checking if the offer id is valid
  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: oid});
    if (!existingOffer) {
      return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Offer not in correct format / INVALID'});
  }

  // Getting the application count for this offer
  let appliedCount;
  try {
    appliedCount = await Applied.countDocuments({ offer: oid });
  } catch (err) {
    const error = new HttpError(
      'Fetching applied users count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ ok:1, count: appliedCount });
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
    return res.json({ ok: -1, message: 'User not in correct format / INVALID'});
  }

  try {
    existingOffer = await Offer.findById({_id: oid});
    if (!existingOffer) {
      return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Offer not in correct format / INVALID'});
  }

  try {
    const existingApplied = await Applied.findOne({ offer: oid, user: uid });
    if (existingApplied !== null) {
      return res.json({ ok: 0, applied: null, message: "User already applied in this offer" })
    }
  } catch (error) {
    console.error(error);
  }

  if (type!=='job' && type!=='internship'){
    return res.json({ ok: -1, applied: null, message: "Offer type is INVALID" });
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
  try {
    createdApplied.resume = req.file.path;
  }
  catch (err){
    console.log("File path error:\n",err);
  }

  try {
    await createdApplied.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new Applied failed, please try again.',
      500
    );
    return next(error);
  } 

  res.json({ ok: 1, applied: createdApplied });
};

// PATCH

const approveOffer = async (req, res, next) => {
  // Checking if date passed in correct or not
  // console.log(req.body);
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { oid, uid } = req.body;

  try {
    existingUser = await User.findById({_id: uid});
    if (!existingUser) {
      return new HttpError('User does not exist', 422);
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'User not in correct format / INVALID'});
  }

  try {
    existingOffer = await Offer.findById({_id: oid});
    if (!existingOffer) {
      return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Offer not in correct format / INVALID'});
  }

  let existingApplied;
  try {
    existingApplied = await Applied.findOne({ offer: oid, user: uid });
    if (existingApplied !== null) {
      existingApplied.isApproved = true;
    }
    existingUser.isEmployee = true;
    await existingUser.save();
  } catch (error) {
    console.error(error);
  }

  try {
    await existingApplied.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new Applied failed, please try again.',
      500
    );
    return next(error);
  } 

  res.json({ ok: 1, applied: existingApplied });
};

const approveOffers = async (req, res, next) => {
  // Checking if data passed in correct or not
  console.log(req.body);
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { alluid, oid } = req.body; // 'alluid' is now an array of user IDs

  // Check if the offer exists
  let existingOffer;
  try {
    existingOffer = await Offer.findById({ _id: oid });
    if (!existingOffer) {
      return next(new HttpError('Offer does not exist', 422));
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Offer not in correct format / INVALID' });
  }

  // Getting the domain for the offer
  let offerDomain;
  try {
    offerDomain = await Domain.findById({_id: existingOffer.domain});
    if (!offerDomain){
      return res.json({ok: -1, message: `Domain ID is invalid for the offer`});
    }
  } catch (err) {
    return res.json({ok: -1, message: `Some error occurred while getting the domain for the offer! ERROR: ${err}`});
  }

  // Iterate over all user IDs and approve the offer for each
  let approvedApplications = [];
  for (let uid of alluid) {

    // Finding the existance of the user with USER ID
    let existingUser;
    try {
      existingUser = await User.findById({ _id: uid });
      if (!existingUser) {
        continue; // Skip this user if they do not exist
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      console.error('Error finding user with ID:', uid, error);
      continue;
    }

    // Finding the existance of the applied and updating it
    let existingApplied;
    try {
      existingApplied = await Applied.findOne({ offer: oid, user: uid });
      if (existingApplied !== null) {
        existingApplied.isApproved = true;
        await existingApplied.save();
        approvedApplications.push(existingApplied); // Add to the approved applications list
      }
    } catch (error) {
      return res.json({ ok:-1, message: `Error approving application for user with ID: ${uid}, ERROR: ${error}`})
    }

    // Updating the reference ID for the existing user
    try {
      existingUser.isEmployee = true;
      await existingUser.save();
      const createNewReferenceId = async (offerDomain) => {
        // const uniqueRefIDNumber = Math.floor(Math.random() * 1000); // Generate a random number
        const uniqueRefIDNumber = uniqueRefIDCounter.toString().padStart(3, '0');
        uniqueRefIDCounter++;
        const year_start = new Date().getFullYear();
        const year_end = (year_start + 1).toString().slice(-2);
        const name1 = offerDomain.name1;
        const name2 = offerDomain.name2;
        return `RNPW/${year_start}-${year_end}/${name1}${uniqueRefIDNumber}${name2}`;
      }
      const referenceId = await createNewReferenceId(offerDomain);
      console.log(referenceId);
      existingUser.ref = referenceId;
      existingUser.domain = offerDomain;
      existingUser.isEmployee = true;
      await existingUser.save();
      console.log("Created reference ID for the user with email: ", existingUser.email,", ref ID:",existingUser.ref);
    } catch (err) {
      return res.json({ ok:-1, message: `Error saving reference ID for USER: ${uid}, ERROR: ${err}`})
    }
  }

  // Respond with all the approved applications
  if (approvedApplications.length > 0) {
    res.json({ ok: 1, applied: approvedApplications, message:"Applications approved and updated reference IDs for the users" });
  } else {
    // If no applications were approved, send a different response
    res.json({ ok: 1, message: 'No applications were approved.' });
  }
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
  getAppliedJobCount,
  checkIfUserAppliedOffer,

  getAppliedUsersInJob,
  getApprovedUsersInJob,
  getAppliedUsersInInternship,
  getApprovedUsersInInternship,
  
  getAppliedWithOfferId,
  getAppliedCountWithOfferId,
  
  applyOffer,
  approveOffer,
  approveOffers
};
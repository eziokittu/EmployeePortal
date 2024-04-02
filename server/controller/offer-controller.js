const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Offer = require('../models/offer');
const Domain = require('../models/domains');
const Applied = require('../models/applied');

// GET

const getInternships = async (req, res, next) => {
  const page = req.query.page || 0;
  const internshipsPerPage = 2;

  let allOffers;
  try {
    allOffers = await Offer
      .find({type: 'internship'})
      .skip(page * internshipsPerPage)
      .limit(internshipsPerPage);
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured!"+err});
  }

  if (!allOffers || allOffers.length === 0) {
    res.json({
      ok: -1,
      message: 'No internships found!',
    });
    return;
  }

  res.json({
    ok: 1,
    jobs: allOffers.map((offer) => offer.toObject({ getters: true })),
  });
  // console.log("DEBUG -- Offer-Controller - Fetching internships successful!");
};

const getJobs = async (req, res, next) => {
  const page = req.query.page || 0;
  const jobsPerPage = 2;

  let allOffers;
  try {
    allOffers = await Offer
      .find({type: 'job'})
      .skip(page * jobsPerPage)
      .limit(jobsPerPage);
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured!"+err});
  }

  if (!allOffers || allOffers.length === 0) {
    res.json({
      ok: -1,
      message: 'No jobs found!',
    });
    return;
  }

  res.json({
    ok: 1,
    jobs: allOffers.map((offer) => offer.toObject({ getters: true })),
  });
  // console.log("DEBUG -- Offer-Controller - Fetching internships successful!");
};

const getInternshipsByDomain = async (req, res, next) => {
  const page = req.query.page || 0;
  const internshipsPerPage = 2;

  const modifiedDomain = req.params['domain'];
  const domain = modifiedDomain.replace(/:/g, '/');

  let existingDomain;
  let allInternships;
  if (domain==='-' || !domain ){
    try {
      allInternships = await Offer
        .find({type: "internship"})
        .skip(page * internshipsPerPage)
        .limit(internshipsPerPage);
    } catch (err) {
      return res.json({ok:-1, message:"Fetching offer with offerId failed, please try again later."})
    }
  }
  else {
    try {
      existingDomain = await Domain.findOne({name: domain});
    } catch (error) {
      return res.json({ok:-1, message: "Domain does not exist with this ID"});
    }
    try {
      allInternships = await Offer
        .find({domain: existingDomain, type: "internship"})
        .skip(page * internshipsPerPage)
        .limit(internshipsPerPage);
    } catch (err) {
      return res.json({ok:-1, message:"Fetching offer with offerId failed, please try again later."})
    }
  }

  res.json({ok:1, message:"Fetching all internships successful", internships: allInternships});
};

const getJobsByDomain = async (req, res, next) => {
  const page = req.query.page || 0;
  const jobsPerPage = 2;

  const modifiedDomain = req.params['domain'];
  const domain = modifiedDomain.replace(/:/g, '/');

  let existingDomain;
  let allJobs;
  if (domain==='-' || !domain ){
    try {
      allJobs = await Offer
        .find({type: "job"})
        .skip(page * jobsPerPage)
        .limit(jobsPerPage);
    } catch (err) {
      return res.json({ok:-1, message:"Fetching offer with offerId failed, please try again later."})
    }
  }
  else {
    try {
      existingDomain = await Domain.findOne({name: domain});
    } catch (error) {
      return res.json({ok:-1, message: "Domain does not exist with this ID"});
    }
    try {
      allJobs = await Offer
        .find({domain: existingDomain, type: "job"})
        .skip(page * jobsPerPage)
        .limit(jobsPerPage);
    } catch (err) {
      return res.json({ok:-1, message:"Fetching offer with offerId failed, please try again later."})
    }
  }

  res.json({ok:1, message:"Fetching all jobs successful", jobs: allJobs});
};

const getOffer = async (req, res, next) => {
  const oid = req.params['oid'];
  // console.log('DEBUG -- offer-controller.js -- 1: '+uid);
  let offer;
  try {
    offer = await Offer.findById(oid);
    if (!offer){
      res.json({ok:-1, message:"No offer found with this ID:",oid});
    }
  } catch (err) {
    res.json({ok:-1, message:"Some error occured!",err});
  }
  res.json({ok:1, offer: offer, message:"Successful!"});
};

const getOfferCount = async (req, res, next) => {
  let offerCount;
  // const { type } = req.body;
  try {
    offerCount = await Offer.countDocuments();
    // offerCount = await Offer.countDocuments({ type: type });
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured!"+err})
  }

  res.json({ok:1, count: offerCount });
  // console.log("DEBUG -- Offer-Controller - Fetching offer count successful!");
};

const getInternshipCount = async (req, res, next) => {
  let offerCount;
  const { type } = req.body;
  try {
    offerCount = await Offer.countDocuments({ type: 'internship' });
  } catch (err) {
    return res.json({ ok:-1, message: 'No internships! count=0'+err });
  }
  res.json({ ok:1, count: offerCount });
};

const getInternshipCountByDomain = async (req, res, next) => {
  const modifiedDomain = req.params['domain'];
  const domain = modifiedDomain.replace(/:/g, '/');

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
  } catch (error) {
    return res.json({ok:-1, message: "Domain does not exist with this ID"});
  }

  let offerCount;
  try {
    offerCount = await Offer.countDocuments({ type: 'internship', domain: existingDomain});
  } catch (err) {
    res.json({ ok:-1, message: 'No jobs! count=0'+err });
    return
  }
  res.json({ ok:1, count: offerCount });
};

const getJobCount = async (req, res, next) => {
  let offerCount;
  try {
    offerCount = await Offer.countDocuments({ type: 'job' });
  } catch (err) {
    res.json({ ok:-1, message: 'No jobs! count=0'+err });
    return
  }
  res.json({ ok:1, count: offerCount });
};

const getJobCountByDomain = async (req, res, next) => {
  const modifiedDomain = req.params['domain'];
  const domain = modifiedDomain.replace(/:/g, '/');

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
  } catch (error) {
    return res.json({ok:-1, message: "Domain does not exist with this ID"});
  }

  let offerCount;
  try {
    offerCount = await Offer.countDocuments({ type: 'job', domain: existingDomain});
  } catch (err) {
    res.json({ ok:-1, message: 'No jobs! count=0'+err });
    return
  }
  res.json({ ok:1, count: offerCount });
};

// POST

const createOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { type, heading, link, domain } = req.body;

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }

  const createdOffer = new Offer({
    domain: domain,
    type: type,
    heading: heading,
    link: link
  });

  try {
    await createdOffer.save();
  } catch (err) {
    return res.json({ok:-1, message: "Some error occured!"});
  }

  res.status(201).json({ok:1, offer: createdOffer});
};

const createInternshipOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { stipend, heading, link, domain } = req.body;

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }

  const createdOffer = new Offer({
    type: 'internship',
    domain: existingDomain,
    stipend: stipend,
    heading: heading,
    link: link
  });

  try {
    await createdOffer.save();
  } catch (err) {
    res.status(201).json({ok:-1, message: "Creating new internship failed!"+err});
  }

  res.status(201).json({ok:1, offer: createdOffer});
};

const createJobOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { ctc, heading, link, domain } = req.body;

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }

  let createdOffer;
  try {
    createdOffer = new Offer({
      type: 'job',
      domain: existingDomain,
      ctc: ctc,
      heading: heading,
      link: link
    });
    await createdOffer.save();
  } catch (err) {
    return res.json({ok:-1, message: "Creating new Job offer failed!"});
  }

  res.status(201).json({ok:1, offer: createdOffer});
};

// PATCH

const editJobOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const  {ctc, heading, link, domain} = req.body;
  const offerId = req.params.oid;

  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: offerId});
    if (!existingOffer) {
      return res.json({ok:-1, message: "Job Offer not found"});
    }
  }
  catch (error) {
    return res.json({ok:-1, message: "Some error occured while finding Job offer"});
  }

  // checking if the domain exists
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured while finind domain!"});
  }

  try {
    existingOffer.ctc = ctc;
    existingOffer.heading = heading;
    existingOffer.link = link;
    existingOffer.domain = existingDomain;
    await existingOffer.save();
    res.status(200).json({ok:1, offer: existingOffer.toObject({ getters: true }) })
  } catch (err) {
    res.json({ok:-1, message: "Some error occured"});
  }
}

const editInternshipOffer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const  {stipend, heading, link, domain} = req.body;
  const offerId = req.params.oid;

  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: offerId});
    if (!existingOffer) {
      return res.json({ok:-1, message: "Internship Offer not found!"});
    }
  }
  catch (error) {
    return res.json({ok:-1, message: "Some error occured while finding Internship offer"});
  }

  // checking if the domain exists
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured while finind domain!"});
  }

  try {
    existingOffer.stipend = stipend;
    existingOffer.heading = heading;
    existingOffer.link = link;
    existingOffer.domain = existingDomain;
    await existingOffer.save();
    res.status(200).json({ok:1, offer: existingOffer.toObject({ getters: true }) })
  } catch (err) {
    res.json({ok:-1, message: "Some error occured"});
  }
}

// DELETE

const deleteOffer = async (req, res, next) => {  
  const oid = req.params['oid'];

  // getting the existing offer with ID
  let existingOffer;
  try {
    existingOffer = await Offer.findById(oid);
    if (!existingOffer){
      return res.json({ok:-1, message:"No offer found with this ID"});
    }
  } catch (err) {
    return res.json({ok:-1, message: "Something went wrong while fetching the offer!",err});
  }
  
  // Delete all the applications to this offer
  let allApplications;
  try {
    allApplications = await Applied.find({offer: existingOffer});
    const applicationIds = allApplications.map(application => application._id);
    await Applied.deleteMany({ _id: { $in: applicationIds } });
  } catch (err) {
    return res.json({ok:-1, message: `Something went wrong while trying to delete the applications linked to the offer! ${err}`});
  }

  // Delete the offer
  try {
    await Offer.deleteOne(existingOffer);
  } catch (err) {
    return res.json({ ok:-1, message: `Something went wrong! ${err}`});
  }

  return res.json({ ok:1, message: 'Offer deleted successfully.' });
};

const deleteOffers = async (req, res, next) => {  
  try {
    // Find offers with date_end older than current date
    const currentDate = new Date();
    const offersToDelete = await Offer.find({ date_end: { $lt: currentDate } });

    if (offersToDelete.length > 0) {
      // Extract offer IDs
      const offerIds = offersToDelete.map(offer => offer._id);

      // Delete all applications associated with these offers
      await Applied.deleteMany({ offer: { $in: offerIds } });

      // Delete the offers
      await Offer.deleteMany({ _id: { $in: offerIds } });
      
      res.status(200).json({ ok:1, message: 'Old offers and their applications deleted successfully.' });
    } else {
      res.status(200).json({ ok:1, message: 'No old offers to delete.' });
    }
  } catch (error) {
    console.error('Error deleting offers and applications:', error);
    res.status(500).json({ ok:-1, message: 'Something went wrong, could not delete offers and their applications.' });
  }
};

const deleteJobs = async (req, res, next) => {  
  try {
    // Find offers with date_end older than current date
    const currentDate = new Date();
    const offersToDelete = await Offer.find({ date_end: { $lt: currentDate }, type: 'job' });

    if (offersToDelete.length > 0) {
      // Extract offer IDs
      const offerIds = offersToDelete.map(offer => offer._id);

      // Delete all applications associated with these offers
      await Applied.deleteMany({ offer: { $in: offerIds } });

      // Delete the offers
      await Offer.deleteMany({ _id: { $in: offerIds } });
      
      res.status(200).json({ ok:1, message: 'Old offers and their applications deleted successfully.' });
    } else {
      res.status(200).json({ ok:1, message: 'No old offers to delete.' });
    }
  } catch (error) {
    console.error('Error deleting offers and applications:', error);
    res.status(500).json({ ok:-1, message: 'Something went wrong, could not delete offers and their applications.' });
  }
};

const deleteInternships = async (req, res, next) => {  
  try {
    // Find offers with date_end older than current date
    const currentDate = new Date();
    const offersToDelete = await Offer.find({ date_end: { $lt: currentDate }, type: 'internship' });

    if (offersToDelete.length > 0) {
      // Extract offer IDs
      const offerIds = offersToDelete.map(offer => offer._id);

      // Delete all applications associated with these offers
      await Applied.deleteMany({ offer: { $in: offerIds } });

      // Delete the offers
      await Offer.deleteMany({ _id: { $in: offerIds } });
      
      res.status(200).json({ ok:1, message: 'Old offers and their applications deleted successfully.' });
    } else {
      res.status(200).json({ ok:1, message: 'No old offers to delete.' });
    }
  } catch (error) {
    console.error('Error deleting offers and applications:', error);
    res.status(500).json({ ok:-1, message: 'Something went wrong, could not delete offers and their applications.' });
  }
};

module.exports = {
  getOffer,
  getInternships,
  getInternshipsByDomain,
  getJobs,
  getJobsByDomain,

  getOfferCount,
  getInternshipCount,
  getInternshipCountByDomain,
  getJobCount,
  getJobCountByDomain,

  createOffer,
  createInternshipOffer,
  createJobOffer,

  editInternshipOffer,
  editJobOffer,

  deleteOffer,
  deleteOffers,
  deleteInternships,
  deleteJobs
};
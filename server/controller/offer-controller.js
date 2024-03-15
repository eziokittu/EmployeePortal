const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Offer = require('../models/offer');
const Domain = require('../models/domains');

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
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
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
    internships: allOffers.map((offer) => offer.toObject({ getters: true })),
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
    const error = new HttpError(
      'Fetching offers failed, please try again later.',
      500
    );
    return next(error);
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
  // console.log("DEBUG -- Offer-Controller - Fetching offer count successful!");
};

const getInternshipCount = async (req, res, next) => {
  let offerCount;
  const { type } = req.body;
  try {
    // offerCount = await Offer.countDocuments();
    offerCount = await Offer.countDocuments({ type: 'internship' });
  } catch (err) {
    return res.json({ ok:-1, message: 'No internships! count=0' });
  }

  res.json({ ok:1, count: offerCount });
  // console.log("DEBUG -- Offer-Controller - Fetching internships count successful!");
};

const getJobCount = async (req, res, next) => {
  let offerCount;
  try {
    // offerCount = await Offer.countDocuments();
    offerCount = await Offer.countDocuments({ type: 'job' });
  } catch (err) {
    // const error = new HttpError(
    //   'Fetching job count failed, please try again later.',
    //   500
    // );
    // return next(error);
    res.json({ ok:-1, message: 'No jobs! count=0' });
    return
  }

  res.json({ ok:1, count: offerCount });
  // console.log("DEBUG -- Offer-Controller - Fetching job count successful!");
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
    existingDomain = Domain.findOne({name: domain});
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
    existingDomain = Domain.findOne({name: domain});
    if (domain!=='-' && !existingDomain){
      return res.json({ok:-1, message: "Domain does not exist!"});
    }
  } catch (error) {
    return res.json({ok:-1, message: "Some Error occured"});
  }

  const createdOffer = new Offer({
    type: 'internship',
    domain: domain,
    stipend: stipend,
    heading: heading,
    link: link
  });

  try {
    await createdOffer.save();
  } catch (err) {
    res.status(201).json({ok:-1, message: "Creating new internship failed!"});
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
    existingDomain = Domain.findOne({name: domain});
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
      domain: domain,
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

  const  {ctc, heading, link} = req.body;
  const offerId = req.params.oid;

  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: offerId});
    // console.log("working1");
    if (!existingOffer) {
      return new HttpError('Offer not found!', 404);
    }
    // console.log("working2");
  }
  catch (error) {
    return new HttpError('Some error occured while finding an offer', 500);
  }

  try {
    existingOffer.ctc = ctc;
    existingOffer.heading = heading;
    existingOffer.link = link;
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

  const  {stipend, heading, link} = req.body;
  const offerId = req.params.oid;

  let existingOffer;
  try {
    existingOffer = await Offer.findById({_id: offerId});
    // console.log("working1");
    if (!existingOffer) {
      return new HttpError('Offer not found!', 404);
    }
    // console.log("working2");
  }
  catch (error) {
    return new HttpError('Some error occured while finding an offer', 500);
  }

  try {
    existingOffer.stipend = stipend;
    existingOffer.heading = heading;
    existingOffer.link = link;
    await existingOffer.save();
    res.status(200).json({ok:1, offer: existingOffer.toObject({ getters: true }) })
  } catch (err) {
    res.json({ok:-1, message: "Some error occured"});
  }
}

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
  getOffer,
  // getOffers,
  getInternships,
  getJobs,
  getOfferCount,
  getInternshipCount,
  getJobCount,

  createOffer,
  createInternshipOffer,
  createJobOffer,

  editInternshipOffer,
  editJobOffer,

  deleteOffer
};
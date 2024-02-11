const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Termination = require('../models/termination');

// GET

const getAllTerminations = async (req, res, next) => {
  const page = req.query.page || 0;
  const terminationsPerPage = 2;

  let terminations;
  try {
    terminations = await Termination
      .find()
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
    terminationCount = await Termination.countDocuments();
  } catch (err) {
    const error = new HttpError(
      'Fetching termination count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({count: terminationCount });
};

const getAppliedTerminations = async (req, res, next) => {
  const page = req.query.page || 0;
  const terminationsPerPage = 2;
  
  let terminations;
  try {
    terminations = await Termination
      .find({isApproved: false})
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

const getAppliedTerminationsCount = async (req, res, next) => {
  let terminationCount;
  try {
    terminationCount = await Termination.countDocuments({isApproved: false});
  } catch (err) {
    const error = new HttpError(
      'Fetching termination count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({count: terminationCount });
};

const getApprovedTerminations = async (req, res, next) => {
  const page = req.query.page || 0;
  const terminationsPerPage = 2;
  
  let terminations;
  try {
    terminations = await Termination
      .find({isApproved: true})
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

const getApprovedTerminationsCount = async (req, res, next) => {
  let terminationCount;
  try {
    terminationCount = await Termination.countDocuments({isApproved: true});
  } catch (err) {
    const error = new HttpError(
      'Fetching termination count failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({count: terminationCount });
};

const applyTermination = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { reason, userId } = req.body;

  const createdTermination = new Termination({
    reason: reason,
    date_applied: Date.now(),
    employee: userId
  });

  try {
    await createdTermination.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new termination failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({termination: createdTermination});
}

const approveTermination = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { terminationId, userId } = req.body;

  try {
    const existingTermination = await Termination.findById(terminationId);
    if (!existingTermination) {
      return next(new HttpError('Termination not found, update failed.', 404));
    }

    if (existingTermination.employee.toString() !== userId){
      console.log(existingTermination.employee, userId);
      return next(new HttpError('UserId does not match, update failed.', 404));
    }

    existingTermination.date_terminated = Date.now();
    existingTermination.isApproved = true;
    await existingTermination.save();

    res.status(201).json({termination: existingTermination});
  }
  catch(error){
    const err = new HttpError(
      'Creating new termination failed, please try again.',
      500
    );
    return next(err);
  }
}

module.exports = {
  getAllTerminations,
  getAppliedTerminations,
  getApprovedTerminations,
  getAllTerminationsCount,
  getAppliedTerminationsCount,
  getApprovedTerminationsCount,
  applyTermination,
  approveTermination
};
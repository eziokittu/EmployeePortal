const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Termination = require('../models/termination');

// GET

const getTerminations = async (req, res, next) => {
  let terminations;
  try {
    terminations = await Termination.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching terminations failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({terminations: terminations.map(termination => termination.toObject({ getters: true }))});
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
  getTerminations,
  applyTermination,
  approveTermination
};
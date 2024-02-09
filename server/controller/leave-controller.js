const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Leave = require('../models/leave');
const User = require('../models/user');

// GET

const getLeaves = async (req, res, next) => {
  let leaves;
  try {
    leaves = await Leave.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching leaves failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({leaves: leaves.map(leave => leave.toObject({ getters: true }))});
};

const applyLeave = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { reason, userId, days } = req.body;

  try {

  }
  catch (err){
    const existingUser = await User.findById({ userId });
    if (!existingUser) {
      return next(new HttpError('User not found, leave apply failed.', 404));
    }

    // if (existingUser.applied_leave === true){
    //   return next(new HttpError('User has already applied for a leave, leave apply failed.', 404));
    // }
  }

  const createdLeave = new Leave({
    reason: reason,
    date_start: Date.now(),
    date_end: Date.now()+(1000*60*60*24*days),
    employee: userId
  });

  try {
    await createdLeave.save();
  } catch (err) {
    const error = new HttpError(
      'Creating new leave failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({leave: createdLeave});
}

const approveLeave = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { leaveId, userId } = req.body;

  try {
    const existingLeave = await Leave.findById(leaveId);
    if (!existingLeave) {
      return next(new HttpError('Leave not found, approve failed.', 404));
    }

    if (existingLeave.employee.toString() !== userId){
      console.log(existingLeave.employee, userId);
      return next(new HttpError('UserId does not match, approve failed.', 404));
    }

    existingLeave.isApproved = true;
    await existingLeave.save();

    res.status(201).json({leave: existingLeave});
  }
  catch(error){
    const err = new HttpError(
      'Approving leave failed, please try again.',
      500
    );
    return next(err);
  }
}

module.exports = {
  getLeaves,
  applyLeave,
  approveLeave
};
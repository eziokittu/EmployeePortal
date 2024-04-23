const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Domain = require('../models/domains');

// GET
const getEmployeesForMonth = async (req, res, next) => {
  const month = req.params.month;
  let count;
  try {
    count = await Applied.countDocuments();
    if (!count || count===0){
      count = 0;
    }
  } catch (err){
    console.error("Something went wrong while fetching applications count!");
    res.json({ok:-1, count:0, message: "Failed to get application count!"});
  }
  res.json({ok:1, count: count, message: "Successfully fetched application count!"});
}

// POST
const postEmployeesForMonth = async (req, res, next) => {

};

// PATCH
const patchEmployeesForMonth = async (req, res, next) => {

};

// DELETE
const deleteEmployeesForMonth = async (req, res, next) => {

};

module.exports = {
  getEmployeesForMonth,
  postEmployeesForMonth,
  patchEmployeesForMonth,
  deleteEmployeesForMonth,
};
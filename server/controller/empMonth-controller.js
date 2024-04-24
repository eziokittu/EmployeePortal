const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Domain = require('../models/domains');
const EmpMonth = require('../models/empMonth');

// GET
const getEmployeesForMonth = async (req, res, next) => {
  const monthYear = req.params.monthyear;
  // console.log(monthYear);
  let existingEmpMonth;
  try {
    existingEmpMonth = await EmpMonth.findOne({monthYear: monthYear});
    if (!existingEmpMonth){
      return res.json({ok:-1, message: "Failed to get the employee of the month"});
    }
  } catch (err){
    res.json({ok:-1, message: "Something went wrong while fetch emp month!"+err});
  }

  // Iterate over all user IDs and approve the offer for each
  let employees = [];
  for (let uid of existingEmpMonth.employees) {

    // Finding the existance of the user with USER ID
    let existingUser;
    try {
      existingUser = await User.findById({ _id: uid });
      if (!existingUser) {
        return res.json({ok:-1, message:'Employee not found with ID:'+uid});
      }
    } catch (error) {
      // Log the error but do not stop processing the rest of the user IDs
      return res.json({ok:-1, message:'Error finding user with ID:'+uid});
    }

    // updating the employee array
    employees.push(existingUser);
  }

  return res.json({ok:1, message: "Successfully fetched application count!", empMonth: existingEmpMonth, employees: employees});
}

// POST

function getFormattedDate (dateString) {
  const months = ['jab', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const [day, month, year] = dateString.split('/');
  const monthName = months[parseInt(month, 10)-1];
  return `${monthName}-${year}`;
}
const postEmployeesForMonth = async (req, res, next) => {
  // Checking if date passed in correct or not
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  
  const { amount, employees } = req.body;

  // Getting the current date
  const currentDate = new Date();
  const formattedDate = getFormattedDate(`${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`)

  // checking if employee of the month already exists for this month
  let existingEmpMonth;
  try {
    existingEmpMonth = await EmpMonth.findOne({monthYear: formattedDate});
    if (existingEmpMonth){
      return res.json({ok:-1, message: `Employee of the moth already exists for this month`});
    }
  }
  catch (err) {
    return res.json("Some error occured while finding the employee month!");
  }

  // Creating the new Employee of the month
  let createdEmpMonth;
  try {
    createdEmpMonth = new EmpMonth({
      monthYear: formattedDate,
      employees: employees,
      amount: amount
    })
  }
  catch (err) {
    return res.json({ok:-1, message: "Some error occured while creating a new employee of the month list"+err});
  }

  return res.json({ok:1, message: "Successful in creating employee of the month list!"})
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
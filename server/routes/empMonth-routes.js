const express = require('express');
const { check } = require('express-validator');

const empMonthController = require('../controller/empMonth-controller');

const router = express.Router();

// GET

router.get('/get/:monthyear', empMonthController.getEmployeesForMonth);
// router.get('/get/internships', empMonthController.getAppliedInternship);

// POST
router.post(
  '/post',
  [
    
  ],
  empMonthController.postEmployeesForMonth
);

// PATCH
// router.patch(
//   '/patch/approve/offers',
//   [],
//   empMonthController.approveOffers
// );

// DELETE

// router.delete(
//   '/delete/:oid',
//   [],
//   empMonthController.deleteOffer
// )

module.exports = router;
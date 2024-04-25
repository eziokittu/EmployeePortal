const express = require('express');
const { check } = require('express-validator');

const empMonthController = require('../controller/empMonth-controller');
const stipendUpload = require('../middlewares/stipend-upload');

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
router.patch(
  '/patch',
  [],
  stipendUpload.single('stipend'),
  empMonthController.patchEmployeesForMonth
);

// DELETE

router.delete(
  '/delete',
  [],
  empMonthController.deleteEmployeesForMonth
)

module.exports = router;
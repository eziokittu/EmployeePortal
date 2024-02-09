const express = require('express');
const { check } = require('express-validator');

const terminationController = require('../controller/termination-controller');

const router = express.Router();
// GET

// Get all the terminations
router.get('/', terminationController.getTerminations);

// POST

// Apply Termiantion
router.post(
  '/apply',
  // [
  //   check('firstname')
  //     .not()
  //     .isEmpty(),
  //   check('lastname')
  //     .not()
  //     .isEmpty(),
  //   check('email')
  //     .normalizeEmail() // Test@test.com => test@test.com
  //     .isEmail(),
  //   check('password').isLength({ min: 6 })
  // ],
  terminationController.applyTermination
);

// PATCH

//approve termination
router.patch(
  '/approve',
  terminationController.approveTermination
)

module.exports = router;

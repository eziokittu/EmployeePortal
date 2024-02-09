const express = require('express');
const { check } = require('express-validator');

const leaveController = require('../controller/leave-controller');

const router = express.Router();
// GET

// Get all the leaves
router.get('/', leaveController.getLeaves);

// POST

// Apply leave
router.post(
  '/apply',
  leaveController.applyLeave
);

// PATCH

//approve leave
router.patch(
  '/approve',
  leaveController.approveLeave
)

module.exports = router;

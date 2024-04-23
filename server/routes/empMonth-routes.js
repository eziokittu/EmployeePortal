const express = require('express');
const { check } = require('express-validator');

const empMonthController = require('../controller/empMonth-controller');

const router = express.Router();

// GET

// router.get('/', empMonthController.getOffers);
// router.get('/get/internships', empMonthController.getAppliedInternship);

// POST

// router.post(
//   '/post',
//   [
//     check('type')
//       .not()
//       .isEmpty(),
//     check('link')
//       .not()
//       .isEmpty(),
//     check('oid'),
//     check('uid')
//   ],
//   resumeUpload.single('resume'),
//   empMonthController.applyOffer
// );

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
const express = require('express');
const { check } = require('express-validator');

const appliedController = require('../controller/applied-controller');
// const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

// router.get('/', offerController.getOffers);
router.get('/get/internships', appliedController.getAppliedInternship);
router.get('/get/jobs', appliedController.getAppliedJobs);
router.get('/get/count/internships', appliedController.getAppliedInternshipCount);
router.get('/get/count/jobs', appliedController.getAppliedJobCount);

// POST

// router.post(
//   '/post/offer',
//   [
//     check('type')
//       .not()
//       .isEmpty(),
//     check('heading')
//       .not()
//       .isEmpty(),
//     check('link')
//       .not()
//       .isEmpty()
//   ],
//   offerController.createOffer
// );

// router.post(
//   '/post/internship',
//   [
//     check('stipend')
//       .not()
//       .isEmpty(),
//     check('heading')
//       .not()
//       .isEmpty(),
//     check('link')
//       .not()
//       .isEmpty()
//   ],
//   offerController.createInternshipOffer
// );

// router.post(
//   '/post/job',
//   [
//     check('ctc')
//       .not()
//       .isEmpty(),
//     check('heading')
//       .not()
//       .isEmpty(),
//     check('link')
//       .not()
//       .isEmpty()
//   ],
//   offerController.createJobOffer
// );

// PATCH

// router.patch(
//   '/edit/apply',
//   [],
//   offerController.applyOffer
// )

// DELETE

// router.delete(
//   '/delete/:oid',
//   [],
//   offerController.deleteOffer
// )

module.exports = router;
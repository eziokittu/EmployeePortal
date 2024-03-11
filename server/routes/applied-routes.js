const express = require('express');
const { check } = require('express-validator');

const appliedController = require('../controller/applied-controller');
const resumeUpload = require('../middlewares/resume-upload');

const router = express.Router();

// GET

// router.get('/', offerController.getOffers);
router.get('/get/internships', appliedController.getAppliedInternship);
router.get('/get/jobs', appliedController.getAppliedJobs);
router.get('/get/count/internships', appliedController.getAppliedInternshipCount);
router.get('/get/count/jobs', appliedController.getAppliedJobCount);
router.get('/get/count/job/:oid', appliedController.getAppliedUsersInJob);
router.get('/get/count/internship/:oid', appliedController.getAppliedUsersInInternship);
router.get('/get/check/:oid/:uid', appliedController.checkIfUserAppliedOffer);
router.get('/get/offer/:oid', appliedController.getAppliedWithOfferId);
router.get('/get/offer/count/:oid', appliedController.getAppliedCountWithOfferId);

// POST

router.post(
  '/post',
  [
    check('type')
      .not()
      .isEmpty(),
    check('link')
      .not()
      .isEmpty(),
    check('oid'),
    check('uid')
  ],
  resumeUpload.single('resume'),
  appliedController.applyOffer
);

// PATCH

router.patch(
  '/patch/approve',
  [
    
    check('oid'),
    check('uid')
  ],
  appliedController.approveOffer
);

// DELETE

// router.delete(
//   '/delete/:oid',
//   [],
//   offerController.deleteOffer
// )

module.exports = router;
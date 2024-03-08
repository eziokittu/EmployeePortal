const express = require('express');
const { check } = require('express-validator');

const appliedController = require('../controller/applied-controller');
const resumeUpload = require('../middlewares/resume-upload');

const router = express.Router();

// router.get('/', offerController.getOffers);
router.get('/get/internships', appliedController.getAppliedInternship);
router.get('/get/jobs', appliedController.getAppliedJobs);
router.get('/get/count/internships', appliedController.getAppliedInternshipCount);
router.get('/get/count/jobs', appliedController.getAppliedJobCount);

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
  '/patch',
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
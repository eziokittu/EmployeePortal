const express = require('express');
const { check } = require('express-validator');

const offerController = require('../controller/offer-controller');
// const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.get('/', offerController.getOffers);
router.get('/internships', offerController.getInternships);
router.get('/jobs', offerController.getJobs);
router.get('/offercount', offerController.getOfferCount);
router.get('/internshipcount', offerController.getInternshipCount);
router.get('/jobcount', offerController.getJobCount);
router.get('/offer/:oid', offerController.getOffer);

router.post(
  '/',
  // fileUpload.single('image'),
  [
    check('type')
      .not()
      .isEmpty(),
    check('heading')
      .not()
      .isEmpty(),
    check('link')
      .not()
      .isEmpty()
  ],
  offerController.createOffer
);

module.exports = router;

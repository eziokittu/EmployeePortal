const express = require('express');
const { check } = require('express-validator');

const certificateController = require('../controller/certificate-controller');
const certificateUpload = require('../middlewares/certificate-upload');

const router = express.Router();

// GET
router.get('/get/', certificateController.getCertificates);
router.get('/get/user/:uid', certificateController.getCertificateByUserId);
router.get('/get/count/', certificateController.getCertificatesCount);
router.get('/get/count/:uid', certificateController.getCertificateCountByUserId);

// POST
router.post(
  '/post/',
  [
    check('userId')
      .not()
      .isEmpty(),
    check('domain')
      .not()
      .isEmpty()
  ],
  certificateUpload.single('certificate'),
  certificateController.postCertificate
);

module.exports = router;
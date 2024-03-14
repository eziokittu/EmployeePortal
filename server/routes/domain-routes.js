const express = require('express');
const { check } = require('express-validator');

const domainController = require('../controller/domain-controller');

const router = express.Router();

// GET

router.get(
  '/get', 
  domainController.getDomains
);

// POST

router.post(
  '/post',
  [
    check('name')
      .not()
      .isEmpty(),
    check('name1')
      .not()
      .isEmpty(),
    check('name2')
      .not()
      .isEmpty()
  ],
  domainController.postDomain
);

// PATCH

router.patch(
  '/patch',
  [
    check('name')
      .not()
      .isEmpty(),
    check('name1')
      .not()
      .isEmpty(),
    check('name2')
      .not()
      .isEmpty()
  ],
  domainController.patchDomain
);

// DELETE

router.delete(
  '/delete',
  [
    check('name')
      .not()
      .isEmpty()
  ],
  domainController.deleteDomain
)

module.exports = router;

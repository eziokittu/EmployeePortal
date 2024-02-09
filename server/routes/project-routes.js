const express = require('express');
const { check } = require('express-validator');

const projectController = require('../controller/project-controller');

const router = express.Router();

router.get('/', projectController.getProjects);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty()
    // check('description')
    //   .not()
    //   .isEmpty()
  ],
  projectController.createProject
);

router.delete(
  // '/delete/:pid',
  '/',
  [
    // check('title')
    //   .not()
    //   .isEmpty()
    // check('description')
    //   .not()
    //   .isEmpty()
  ],
  projectController.deleteProject
);

router.patch(
  '/edit/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty()
  ],
  projectController.updateProjectInfo
);

module.exports = router;

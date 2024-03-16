const express = require('express');
const { check } = require('express-validator');

const projectController = require('../controller/project-controller');

const router = express.Router();

router.get('/', projectController.getProjects);
router.get('/emp/all/:uid', projectController.getProjectsByEmployeeId);
router.get('/emp/completed/:uid', projectController.getCompletedProjectsByEmployeeId);
router.get('/emp/ongoing/:uid', projectController.getOngoingProjectsByEmployeeId);
router.get('/count', projectController.getProjectCount);
router.get('/count/emp/:uid', projectController.getProjectCountByEmployeeId);
router.get('/completed', projectController.getProjectsCompletedCount);
router.get('/ongoing', projectController.getProjectsOngoingCount);

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

router.patch(
  '/edit/addemployees/:pid',
  [
    // check('title')
    //   .not()
    //   .isEmpty(),
    // check('description')
    //   .not()
    //   .isEmpty()
  ],
  projectController.addProjectMembers
);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');

const projectController = require('../controller/project-controller');
const srsUpload = require('../middlewares/srs-upload');

const router = express.Router();

router.get('/', projectController.getProjects);
router.get('/emp/all/:uid', projectController.getProjectsByEmployeeId);
router.get('/emp/completed/:uid', projectController.getCompletedProjectsByEmployeeId);
router.get('/emp/ongoing/:uid', projectController.getOngoingProjectsByEmployeeId);
router.get('/count', projectController.getProjectCount);
router.get('/count/emp/:uid', projectController.getProjectCountByEmployeeId);
router.get('/count/emp/ongoing/:uid', projectController.getOngoingProjectCountByEmployeeId);
router.get('/count/emp/completed/:uid', projectController.getCompletedProjectCountByEmployeeId);
router.get('/count/completed', projectController.getProjectsCompletedCount);
router.get('/count/ongoing', projectController.getProjectsOngoingCount);

router.post(
  '/',
  [
    // check('title')
    //   .not()
    //   .isEmpty()
    // check('description')
    //   .not()
    //   .isEmpty()
  ],
  srsUpload.single('srs'),
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
  '/patch/:pid',
  [
    // check('title')
    //   .not()
    //   .isEmpty(),
    // check('description')
    //   .not()
    //   .isEmpty()
  ],
  projectController.updateProjectInfo
);

router.patch(
  '/patch/addemployees/:pid',
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

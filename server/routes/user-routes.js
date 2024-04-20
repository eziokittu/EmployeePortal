const express = require('express');
const { check } = require('express-validator');

const userController = require('../controller/user-controller');
const imageUpload = require('../middlewares/image-upload');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/count', userController.getUserCount);
router.get('/user/id/:uid', userController.getUserById);
router.get('/user/email/:email', userController.getUserByEmail);
router.get('/user/username/:username', userController.getUserByUsername);
router.get('/employees/project/:pid', userController.getEmployeesByProjectId);

router.get('/emp', userController.getEmployees);
router.get('/emp/id/:uid', userController.getEmployeeById);
router.get('/emp/email/:email', userController.getEmployeeByEmail);
router.get('/emp/username/:username', userController.getEmployeeByUsername);
router.get('/emp/ref/:ref', userController.getEmployeeByRef);
router.get('/emp/search/email/:search_email', userController.searchEmployeeByEmail);
router.get('/emp/search/ref/:search_ref', userController.searchEmployeeByRef);
router.get('/empcount', userController.getEmployeeCount);

router.get('/terminations', userController.getAllTerminations);
router.get('/terminationcount', userController.getAllTerminationsCount);
router.get('/terminationstatus/id/:uid', userController.getTerminationStatusById);
router.get('/terminationstatus/email/:email', userController.getTerminationStatusByEmail);

router.post(
  '/signup',
  [
    check('firstname')
      .not()
      .isEmpty(),
    check('lastname')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  userController.signup
);

router.post('/login', userController.login);

router.post(
  '/recovery/verify-details',
  [
    check('email')
      .not()
      .isEmpty(),
    check('phone')
      .not()
      .isEmpty()
      .isLength({ min: 10 })
  ],
  userController.verifyUserDetailsOnRecovery
);

// PATCH: Update user info

router.patch(
  '/recovery/generate-password',
  [
    check('email')
      .not()
      .isEmpty(),
    check('phone')
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
    check('password')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
  ],
  userController.updateUserPasswordOnRecovery
);

router.patch(
  '/edit/password/:uid',
  [
    check('oldPassword')
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    check('newPassword')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
  ],
  userController.updateUserPassword
);
// PATCH: Update user info
router.patch(
  '/edit/role/:empId',
  [
    
  ],
  userController.updateEmployeeRole
);

// PATCH: Update user info
router.patch(
  '/edit/ref/:empId',
  [
    
  ],
  userController.updateEmployeeRef
);

// PATCH: Update user info
router.patch(
  '/edit/info/:uid',
  [
    check('firstname')
      .not()
      .isEmpty(),
    check('lastname')
      .not()
      .isEmpty(),
    check('userName')
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("userName must be atleast 2 characters long"),
    check('phone')
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
    check('bio')
      .not()
      .isEmpty()
  ],
  userController.updateUserInfo
);

// PATCH: Update user image
router.patch(
  '/edit/imageupdate/:uid',
  imageUpload.single('image'),
  userController.updateUserImage
);

// PATCH: Update user image
router.patch(
  '/edit/imagedelete/:uid',
  userController.removeUserImage
);

// PATCH: Update user to employee
router.patch(
  '/edit/usertoemp/',
  [check('userId').not().isEmpty()],
  userController.updateUserAsEmployee
);

// PATCH: Update Employee to user
router.patch(
  '/edit/emptouser/',
  [check('userId').not().isEmpty()],
  userController.updateEmployeeAsUser
);

// PATCH: Update Employee rating
router.patch(
  '/edit/rating/',
  [
    check('userId')
      .not()
      .isEmpty(),
    check('rating')
      .not()
      .isEmpty(),
  ],
  userController.giveRating
);

// PATCH: Terminate an employee by email
router.patch(
  '/edit/terminate',
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
  ],
  userController.terminateEmployeeByEmail
);

// PATCH: Un terminate an employee by email
router.patch(
  '/edit/unterminate',
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
  ],
  userController.unterminateEmployeeByEmail
);

// PATCH: set user mobile verified status to true
router.patch(
  '/edit/mobile-verified',
  [
    check('userId')
      .not()
      .isEmpty(),
    check('phone')
      .not()
      .isEmpty()
  ],
  userController.setmobileOtpVerificationTrue
);

// DELETE user
router.delete(
  '/delete/:uid',
  [
    check('password')
      .not()
      .isEmpty()
      // .isLength({ min: 6 })
  ],
  userController.deleteUser
);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');

const userController = require('../controller/user-controller');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/user/:uid', userController.getUser);
router.get('/emp', userController.getEmployees);
router.get('/emp/:uid', userController.getEmployee);
router.get('/empcount', userController.getEmployeeCount);

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

// PATCH: Update user info
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
  fileUpload.single('image'),
  userController.updateUserImage
);

// PATCH: Update user image
router.patch(
  '/edit/imagedelete/:uid',
  userController.removeUserImage
);

// PATCH: Update user to employee
router.patch(
  '/edit/usertoemp',
  [check('userName').not().isEmpty()],
  userController.updateUserAsEmployee
);

// PATCH: Update Employee to user
router.patch(
  '/edit/emptouser',
  [check('userName').not().isEmpty()],
  userController.updateEmployeeAsUser
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

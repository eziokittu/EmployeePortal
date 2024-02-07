const express = require('express');
const { check } = require('express-validator');

const projectController = require('../controller/project-controller');
// const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

// router.get('/', userController.getUsers);
// router.get('/user/:uid', userController.getUser);
// router.get('/emp', userController.getEmployees);
// router.get('/empcount', userController.getEmployeeCount);

// router.post(
//   '/signup',
//   // fileUpload.single('image'),
//   [
//     check('firstname')
//       .not()
//       .isEmpty(),
//     check('lastname')
//       .not()
//       .isEmpty(),
//     check('email')
//       .normalizeEmail() // Test@test.com => test@test.com
//       .isEmail(),
//     check('password').isLength({ min: 6 })
//   ],
//   userController.signup
// );

// router.post('/login', userController.login);

module.exports = router;

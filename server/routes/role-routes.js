const express = require('express');
const { check } = require('express-validator');

const roleController = require('../controller/role-controller');

const router = express.Router();

// GET

router.get(
  '/get', 
  roleController.getRoles
);
router.get(
  '/get/employee/:eid', 
  roleController.getRoleByEmployeeId
);
router.get(
  '/get/id/:roleId', 
  roleController.getRole
);
router.get(
  '/get/name/:roleName', 
  roleController.getRoleByName
);

// POST

router.post(
  '/post',
  [
    check('name')
      .not()
      .isEmpty()
  ],
  roleController.postRole
);

// DELETE

router.delete(
  '/delete',
  [
    check('name')
      .not()
      .isEmpty()
  ],
  roleController.deleteRole
)

module.exports = router;

const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Role = require('../models/role');
const User = require('../models/user');

// GET

const getRoles = async (req, res, next) => {
  let allRoles;
  try {
    allRoles = await Role.find();
    if (!allRoles || allRoles.length === 0) {
      return res.json({
        ok: -1,
        message: 'No Roles found!',
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching all Roles failed!"});
  }

  res.json({ok:1,  message: "Successfully Fetched all Roles", roles: allRoles});
};

const getRole = async (req, res, next) => {
  const roleId = req.params.roleId;

  let existingRole;
  try {
    existingRole = await Role.findOne({_id: roleId});
    if (!existingRole) {
      return res.json({
        ok: -1,
        message: 'Role not found!',
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching Role failed!"});
  }

  return res.json({ok:1, message: "Successfully Fetched the Role", Role: existingRole});
};

const getRoleByName = async (req, res, next) => {
  const roleName = req.params.roleName;

  let existingRole;
  try {
    existingRole = await Role.findOne({name: roleName});
    if (!existingRole) {
      return res.json({
        ok: -1,
        message: 'Role not found!',
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching Role failed!"});
  }

  return res.json({ok:1, message: "Successfully Fetched the Role", role: existingRole});
};


const getRoleByEmployeeId = async (req, res, next) => {
  const eid = req.params.eid;

  let existingEmployee;
  try {
    existingEmployee = await User.findById({_id: eid, isEmployee: true})
  } catch (err) {
    return res.json({ok:-1, message: "Fetching employee failed! "+err})
  }

  if (!existingEmployee) {
    res.json({
      ok: -1,
      message: "Employee does not exist with this ID",
    });
    return;
  }

  let existingRole;
  try {
    existingRole = await Role.findById({_id: existingEmployee.role});
  } catch (err) {
    return res.json({ok:-1, message: "Fetching employee Role failed! "+err})
  }

  if (!existingRole) {
    res.json({
      ok: -1,
      message: "Role is not found with this role ID",
    });
    return;
  }

  // console.log(existingRole);
  return res.json({ok:1, message: "Successfully Fetched the Role", role: existingRole});
};

// POST

const postRole = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name } = req.body;

  // Check if Role with the same name already exists
  let existingRole;
  try {
    existingRole = await Role.findOne({ name: name });
    if (existingRole) {
      return res.json({ ok: -1, message: 'Role already exists!' });
    }
  } catch (error) {
    console.error("Error checking existing Role:", error);
    return res.json({ ok: -1, message: 'Some error occurred' });
  }

  // Create new Role
  let createdRole;
  try {
    createdRole = new Role({
      name: name
    });
    await createdRole.save();
  } catch (error) {
    console.error("Error creating Role:", error);
    return res.json({ ok: -1, message: 'Some error occurred' });
  }

  res.json({ ok: 1, message: 'Role successfully created', role: createdRole });
};


// DELETE

const deleteRole = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name } = req.body;

  let existingRole;
  try {
    existingRole = await Role.findOne({ name: name });
    if (!existingRole) {
      return res.json({ ok: -1, message: 'Role name INVALID'});
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occured'});
  }

  try {
    await Role.deleteOne(existingRole);
  } catch (err) {
    return res.json({ ok: -1, message: 'Failed to delete Role'});
  }

  res.json({ ok: 1, message: `Role ${name} successfully removed!`});
};

module.exports = {
  getRole,
  getRoleByName,
  getRoleByEmployeeId,
  getRoles,
  postRole,
  deleteRole
};
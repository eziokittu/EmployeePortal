const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Domain = require('../models/domains');

// Some data
// const domains = ["WEBDEV", "APPDEV", "ML/AI", "UI/UX", "TEAMLEAD", "CYBERSECURITY", "GRAPHICSDESIGN", "VIDEOEDITOR", "MARKETING", "DIGITALMARKETING"];

// GET

const getDomains = async (req, res, next) => {
  let allDomains;
  try {
    allDomains = await Domain.find();
    if (!allDomains || allDomains.length === 0) {
      res.json({
        ok: 1,
        count: 0,
        message: 'No domains found!',
      });
      return;
    }
  } catch (err) {
    res.json({ok:-1, message: "Fetching all domains failed!"});
  }

  res.json({ok:1, count:1, message: "Successfully Fetched all domains", domains: allDomains});
};

const getDomain = async (req, res, next) => {
  const domainId = req.params.domainId;

  let existingDomains;
  try {
    existingDomains = await Domain.findOne({_id: domainId});
    if (!existingDomains) {
      res.json({
        ok: 1,
        message: 'Domain not found!',
      });
      return;
    }
  } catch (err) {
    res.json({ok:-1, message: "Fetching domain failed!"});
  }

  res.json({ok:1, message: "Successfully Fetched the domain", domain: existingDomains});
};

// POST

const postDomain = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, name1, name2 } = req.body;

  // Check if domain with the same name already exists
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({ name: name });
    if (existingDomain) {
      return res.json({ ok: -1, message: 'Domain already exists!' });
    }
  } catch (error) {
    console.error("Error checking existing domain:", error);
    return res.json({ ok: -1, message: 'Some error occurred' });
  }

  // Create new domain
  let createdDomain;
  try {
    createdDomain = new Domain({
      name: name,
      name1: name1,
      name2: name2
    });
    await createdDomain.save();
  } catch (error) {
    console.error("Error creating domain:", error);
    return res.json({ ok: -1, message: 'Some error occurred' });
  }

  res.json({ ok: 1, message: 'Domain successfully created', domain: createdDomain });
};

// PATCH

const patchDomain = async (req, res, next) => {
  // Validate request body against a validation schema
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: -1, message: 'Invalid inputs passed, please check your data.', errors: errors.array() });
  }

  const { name, newName, name1, name2 } = req.body;

  try {
    // Find the existing domain
    let existingDomain = await Domain.findOne({ name: name });
    if (!existingDomain) {
      return res.status(404).json({ ok: -1, message: 'Domain not found' });
    }

    // Update domain fields
    existingDomain.name = newName;
    existingDomain.name1 = name1;
    existingDomain.name2 = name2;

    // Save the updated domain
    await existingDomain.save();

    // Respond with success message and updated domain object
    res.json({ ok: 1, message: 'Domain successfully updated', domain: existingDomain });
  } catch (error) {
    console.error("Error updating domain:", error);
    res.status(500).json({ ok: -1, message: 'An error occurred while updating the domain.' });
  }
};


// DELETE

const deleteDomain = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name } = req.body;

  let existingDomain;
  try {
    existingDomain = await Domain.findOne({ name: name });
    if (!existingDomain) {
      return res.json({ ok: -1, message: 'Domain name INVALID'});
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occured'});
  }

  try {
    await Domain.deleteOne(existingDomain);
  } catch (err) {
    return res.json({ ok: -1, message: 'Failed to delete Domain'});
  }

  res.json({ ok: 1, message: `Domain ${name} successfully removed!`});
};

module.exports = {
  getDomain,
  getDomains,
  postDomain,
  patchDomain,
  deleteDomain
};
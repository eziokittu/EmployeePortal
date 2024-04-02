const { validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const Domain = require('../models/domains');
const User = require('../models/user');
const Certificate = require('../models/certificate');

// GET

const getCertificates = async (req, res, next) => {
  let allCertificates;
  try {
    allCertificates = await Certificate.find();
    if (!allCertificates || allCertificates.length === 0) {
      return res.json({
        ok: -1,
        message: 'No certificate found!',
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching all certificates failed!"});
  }

  res.json({ok:1,  message: "Successfully Fetched all certificate", certificates: allCertificates});
};

const getCertificatesCount = async (req, res, next) => {
  let certificatesCount;
  try {
    certificatesCount = await Certificate.countDocuments();
    if (!certificatesCount || certificatesCount===0) {
      return res.json({
        ok: 1,
        message: 'No certificate found!',
        count: 0
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching all certificates count failed!"});
  }

  res.json({ok:1, message: "Successfully Fetched certificate count", count: certificatesCount});
};

const getCertificateByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // Check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ _id: userId, isEmployee: true, isAdmin: false });
    if (!existingUser) {
      return res.json({ ok: -1, message: 'User does not exist with this userID:'+userId });
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occurred while checking User' });
  }

  let allCertificates;
  try {
    allCertificates = await Certificate.find({user: userId});
    if (!allCertificates || allCertificates.length === 0) {
      return res.json({
        ok: -1,
        message: 'No certificate found!',
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching all certificates failed!"});
  }

  res.json({ok:1,  message: "Successfully Fetched all certificate", certificates: allCertificates});
};

const getCertificateCountByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // Check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ _id: userId, isEmployee: true, isAdmin: false });
    if (!existingUser) {
      return res.json({ ok: -1, message: 'User does not exist with this userID:'+userId });
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occurred while checking User' });
  }

  let count;
  try {
    count = await Certificate.countDocuments({user: userId});
    if (!count || count.length === 0) {
      return res.json({
        ok: -1,
        message: 'No certificate found!',
        count: 0
      });
    }
  } catch (err) {
    return res.json({ok:-1, message: "Fetching certificate count failed!"});
  }

  res.json({ok:1,  message: "Successfully Fetched all certificates count", count: count});
};

// POST

const postCertificate = async (req, res, next) => {
  // Validate inputs
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ errors: errors.array() });
  // }

  const { domain, userId } = req.body;

  // Check if domain exists
  let existingDomain;
  try {
    existingDomain = await Domain.findOne({ name: domain });
    if (!existingDomain) {
      return res.json({ ok: -1, message: 'Domain does not exist!' });
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occurred while checking domain' });
  }

  // Check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ _id: userId, isEmployee: true });
    if (!existingUser) {
      return res.json({ ok: -1, message: 'User does not exist with this userID:'+userId });
    }
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occurred while checking User' });
  }

  // Create new Certificate
  let createdCertificate;
  try {
    createdCertificate = new Certificate({
      user: existingUser,
      domain: existingDomain
    });
    await createdCertificate.save();
  } catch (error) {
    return res.json({ ok: -1, message: 'Some error occurred while creating certificate' });
  }

  // Linking the certificate
  try {
    createdCertificate.certificate = req.file.path;
    await createdCertificate.save();
  }
  catch (err2){
    console.log("File path error:\n",err2);
  }

  res.json({ ok: 1, message: 'Certificate successfully issued', certificate: createdCertificate });
};


module.exports = {
  getCertificates,
  getCertificatesCount,
  getCertificateByUserId,
  getCertificateCountByUserId,
  postCertificate
};
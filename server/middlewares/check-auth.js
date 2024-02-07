const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    // console.log("working 1");
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    // console.log("working 2 -- token: "+token);
    if (!token) {
      throw new Error('Authentication failed!');
    }
    // console.log("working 3");
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    // console.log("working 4");
    req.userData = { userId: decodedToken.userId };
    // console.log("working 5");
    next();
    // console.log("working 6");
  } catch (err) {
    // console.log("working 7");
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};

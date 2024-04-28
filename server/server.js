require('dotenv').config()
const User = require('./models/user');
const Role = require('./models/role');
const bcrypt = require('bcryptjs');

// libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();

// routes
const userRoutes = require('./routes/user-routes');
const empMonthRoutes = require('./routes/empMonth-routes');
const projectRoutes = require('./routes/project-routes');
const offerRoutes = require('./routes/offer-routes');
const appliedRoutes = require('./routes/applied-routes');
const domainRoutes = require('./routes/domain-routes');
const roleRoutes = require('./routes/role-routes');
const certificateRoutes = require('./routes/certificate-routes');

const HttpError = require('./models/http-error');

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/uploads/resume', express.static(path.join('uploads', 'resume')));
app.use('/uploads/certificates', express.static(path.join('uploads', 'certificates')));
app.use('/uploads/stipends', express.static(path.join('uploads', 'stipends')));
app.use('/uploads/srs', express.static(path.join('uploads', 'srs')));
app.use('/uploads/receipts', express.static(path.join('uploads', 'receipts')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/applied', appliedRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/empmonth', empMonthRoutes);
app.use('/api/certificates', certificateRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route. ['+req.body.url+']', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const port = process.env.DB_PORT || 5000;
// MongoDB ATLAS
// const uriDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nmjiwwv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; 

// MongoDB Community Server
const uriDB = 'mongodb://127.0.0.1:27017/rnpsoft_employee_portal'; 

mongoose
  .connect(
    uriDB,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("LOG - MongoDB connected successfully");

    // Check if admin user exists
    const adminUser = await User.findOne({ email: process.env.DB_ADMIN_EMAIL });
    if (!adminUser) {
      // If admin user doesn't exist, create it
      const hashedPassword = await bcrypt.hash(process.env.DB_ADMIN_PASSWORD, 12);
      await User.create({ 
        email: process.env.DB_ADMIN_EMAIL,
        password: hashedPassword,
        // password: process.env.DB_ADMIN_PASSWORD,
        firstname: process.env.DB_ADMIN_FIRSTNAME,
        lastname: process.env.DB_ADMIN_LASTNAME,
        userName: process.env.DB_ADMIN_USERNAME,
        isAdmin: true,
        isEmployee: false,
        role: "ADMIN",
        tenure: "permanent",
        isTerminated: false,
        employeeCount: 1,
      });
      console.log("LOG - Admin user created successfully");
    } 
    else {
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(process.env.DB_ADMIN_PASSWORD, adminUser.password);
      } catch (err) {
        console.log("Some error occured while comparing passwords!"+err);
      }

      // is password does not match, update password
      if (!isValidPassword) {
        try {
          const hashedPassword = await bcrypt.hash(process.env.DB_ADMIN_PASSWORD, 12);
          adminUser.password = hashedPassword;
        } catch (e) {
          console.log("Some error occured while updating ADMIN password!"+e);
        }
        console.log("LOG - Admin user already exists. Password is updated!");
      }

      else {
        console.log("LOG - Admin user already exists");
      }
    }

    // Check if "member" role exists
    const memberRole = await Role.findOne({ name: 'member' });
    if (!memberRole) {
      // If 'member' role doesn't exist, create it
      await Role.create({ 
        name: 'member'
      });
      console.log("LOG - 'member' role created successfully");
    } else {
      console.log("LOG - 'member' role already exists");
    }

    // Set the employee count
    try {
      let count = await User.countDocuments({isEmployee: true, isTerminated: false});
      if (!count || count===0){
        count = 1;
        console.log("LOG - [no employees]");
      }
      else {
        console.log("LOG - Employee count: "+count);
      }
      adminUser.employeeCount = count;
      await adminUser.save();
    } catch (err) {
      console.log("LOG - Some error occured: "+err);
    }

    // Set the certificates issued count
    try {
      let count1 = await adminUser.certificatesIssued;
      if (!count1 || count1===0){
        console.log("LOG - [no certificates issued]");
        adminUser.certificatesIssued = 0;
        adminUser.save();
      }
      else {
        console.log("LOG - Certificates Issued: "+count1);
      }
    } catch (err) {
      console.log("LOG - Some error occured: "+err);
    }

    // Logging the terminated employees 
    try {
      let count2 = await User.countDocuments({isEmployee: true, isTerminated: true});
      if (!count2 || count2===0){
        console.log("LOG - [no terminated employees]");
      }
      else {
        console.log("LOG - Terminated Employee count: "+count2);
      }
    } catch (err) {
      console.log("LOG - ERROR in fetching termination count!");
    }

    // Logging the registered users 
    try {
      let count3 = await User.countDocuments({isAdmin: false});
      if (!count3 || count3===0){
        console.log("LOG - [no registered users]");
      }
      else {
        console.log("LOG - Registered User count: "+count3);
      }
    } catch (err) {
      console.log("LOG - ERROR in fetching user count!");
    }

    // Start the server
    app.listen(port, () => {
      console.log(`LOG - Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
    console.log("LOG - Server failed to connect");
  });

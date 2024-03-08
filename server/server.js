require('dotenv').config()

// libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();

// routes
const userRoutes = require('./routes/user-routes');
const projectRoutes = require('./routes/project-routes');
const offerRoutes = require('./routes/offer-routes');
const appliedRoutes = require('./routes/applied-routes');

const HttpError = require('./models/http-error');

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/uploads/resume', express.static(path.join('uploads', 'resume')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// app.use(express.urlencoded({extended: true}));
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/applied', appliedRoutes);

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
  .then(() =>{
    app.listen(5000);
    console.log("LOG - Server running on port", 5000);
  })
  .catch(err => {
    console.log(err);
    console.log("LOG - Server failed to connect");
  });

const multer = require('multer');
const uuid = require('uuid/v1');

function makeFileName() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month (zero-based index)
  const day = ('0' + date.getDate()).slice(-2); // Day
  const hours = ('0' + date.getHours()).slice(-2); // Hours
  const minutes = ('0' + date.getMinutes()).slice(-2); // Minutes
  const seconds = ('0' + date.getSeconds()).slice(-2); // Seconds
  
  // Creating the new filename format
  return newFileName = `${year}${month}${day}.${hours}${minutes}${seconds}`;
}

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const imageUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      // cb(null, uuid() + '.' + ext);
      cb(null, makeFileName()+'.'+file.originalname.split('.')[0]+'.'+ ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = imageUpload;

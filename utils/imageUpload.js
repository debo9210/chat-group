const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const router = express.Router();

//database config
const mongoURI = require('../config/keys').mongoURI;

//create mongoose connection for image storage
const CONN = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

//init GFS
let gfs;
let gridFSBucket;

CONN.once('open', () => {
  //innit stream
  gfs = Grid(CONN.db, mongoose.mongo);
  gridFSBucket = new mongoose.mongo.GridFSBucket(CONN.db, {
    bucketName: 'uploads',
  });
  gfs.collection('uploads');
});

//create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }

        const fileName = buff.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          fileName,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const maxSize = 1 * 3000 * 3000;
const uploadFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
    return callback(new Error('Wrong extension type'), false);
  }
  callback(null, true);
};
const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: uploadFilter,
}).single('imageUpload');

// @ route GET user/profile-image/:filename
// @ description get image by filename upload route
// @ access Public
router.get('/:filename', (req, res) => {
  let errors = {};

  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err) throw err;
    //check if file exists
    if (!file || file.length === 0 || file === null) {
      errors.imageUpload = 'No file exists';
      return res.status(400).json(errors);
    }

    //check content type and stream to browser
    if (
      file.contentType === 'image/jpeg' ||
      file.contentType === 'image/jpg' ||
      file.contentType === 'image/png' ||
      file.contentType === 'image/gif'
    ) {
      const readStream = gridFSBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      errors.imageUpload = 'Not an image';
      res.status(404).json(errors);
    }
  });
});

module.exports = {
  router,
  upload,
};

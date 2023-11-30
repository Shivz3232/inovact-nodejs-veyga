// multerConfig.js
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from './s3';

const config = require('../config/config');

const upload = (foldername, filename) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: 'my-bucket-name',
      key: function (req, file, cb) {
        const fullPath = `inovact-documents/${config.env}/${foldername}/${filename}/${file.originalname}`;
        cb(null, fullPath);
      },
    }),
  });
};

export default upload;

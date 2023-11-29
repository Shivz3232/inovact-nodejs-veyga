const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'my-bucket-name', // Replace with your bucket name
    acl: 'public-read', // Adjust the ACL according to your needs
    key: function (request, file, cb) {
      console.log(file);
      cb(null, file.originalname); // Use Date.now() for unique file keys
    },
  }),
});

module.exports = upload;

const AWS = require('aws-sdk');

const config = require('../config/config');

const S3 = new AWS.S3();

const uploadToS3 = async (key, data) => {
  const params = {
    Bucket: config.s3Bucket,
    Key: key,
    Body: data,
  };

  const result = await S3.putObject(params).promise();

  return result;
};

module.exports = uploadToS3;

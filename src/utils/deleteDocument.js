const AWS = require('aws-sdk');

const config = require('../config/config');

const S3 = new AWS.S3();

const deleteDocument = async (key) => {
  const params = {
    Bucket: config.s3Bucket,
    Key: key,
  };

  const result = await S3.deleteObject(params).promise();

  return result;
};

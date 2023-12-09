const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const config = require('../config/config');

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const generateS3SignedURL = async (key) => {
  const clientUrl = await createPresignedUrlWithClient({
    region: config.region,
    bucket: config.s3Bucket,
    key,
  });

  return clientUrl;
};

module.exports = generateS3SignedURL;

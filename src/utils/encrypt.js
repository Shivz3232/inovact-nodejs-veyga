const {
  KmsKeyringNode,
  buildClient,
  CommitmentPolicy,
} = require('@aws-crypto/client-node');

const { encrypt } = buildClient(
  CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
);

async function KMSEncrypter(data) {
  const generatorKeyId = process.env.KMS_GENERATOR_KEY_ID;

  const keyIds = [process.env.KMS_KEY_ID];

  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

  const context = {
    stage: process.env.NODE_ENV,
    purpose: process.env.KMS_CONTEXT_PURPOSE,
    origin: process.env.KMS_REGION,
  };

  const { result } = await encrypt(keyring, data, {
    encryptionContext: context,
  });

  return result;
}

module.exports = {
  KMSEncrypter,
};

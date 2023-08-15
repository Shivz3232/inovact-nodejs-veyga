const { KmsKeyringNode, buildClient, CommitmentPolicy } = require('@aws-crypto/client-node');

const { decrypt } = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT);

async function KMSDecrypter(data) {
  const generatorKeyId = process.env.KMS_GENERATOR_KEY_ID;

  const keyIds = [process.env.KMS_KEY_ID];

  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

  const context = {
    stage: process.env.NODE_ENV,
    purpose: process.env.KMS_CONTEXT_PURPOSE,
    origin: process.env.KMS_REGION,
  };

  const { plaintext, messageHeader } = await decrypt(keyring, data);

  const { encryptionContext } = messageHeader;

  Object.entries(context).forEach(([key, value]) => {
    if (encryptionContext[key] !== value) throw new Error('Encryption Context does not match expected values');
  });

  return plaintext.toString();
}

module.exports = {
  KMSDecrypter,
};

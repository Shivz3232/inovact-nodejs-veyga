const { KMSDecrypter: decrypt } = require('./decrypt');

async function decryptMessage(encryptedMessage) {
  const data = Buffer.from(encryptedMessage.slice(2), 'hex');
  const decryptedMessage = await decrypt(data);
  return decryptedMessage;
}

module.exports = {
  decryptMessage,
};

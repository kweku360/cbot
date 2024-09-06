const crypto = require('crypto');

function generateUniqueId(string) {
  // Normalize the string (e.g., convert to lowercase, remove spaces)
  const normalizedString = string.toLowerCase().replace(/\s+/g, '');

  // Create a unique hash using the SHA-256 algorithm
  const hash = crypto.createHash('sha256').update(normalizedString).digest('base64');

  return hash;
}

function decodeUniqueId(hash) {
  // Decode the Base64-encoded hash
  const decodedHash = Buffer.from(hash, 'base64');

  // Create a SHA-256 hash object and update it with the decoded hash
  const sha256 = crypto.createHash('sha256').update(decodedHash);

  // Get the digest as a string
  const normalizedString = sha256.digest('utf8');

  return normalizedString;
}

module.exports = {generateUniqueId,decodeUniqueId};
function generateOtp(length) {
  let otp = '';

  for (let i = 0; i < length; i += 1) {
    otp += Math.floor(Math.random() * 10); // Appends a random digit (0-9)
  }

  return otp;
}

module.exports = generateOtp;

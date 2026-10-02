const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  // Encrypt the password before saving it to the database
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = { hashPassword };

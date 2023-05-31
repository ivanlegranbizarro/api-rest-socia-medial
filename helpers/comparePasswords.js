const bcrypt = require('bcrypt-nodejs');

const comparePasswords = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

module.exports = comparePasswords;

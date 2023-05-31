const jwt = require('jwt-simple');
const moment = require('moment');

require('dotenv').config();

const createToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
  };

  return jwt.encode(payload, process.env.SECRET_KEY);
};

module.exports = createToken;

const jwt = require('jwt-simple');
const moment = require('moment');
require('dotenv').config();

authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'No autorizado' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  const payload = jwt.decode(token, process.env.SECRET_KEY);

  if (!payload) {
    return res.status(401).send({ message: 'No autorizado' });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'El token ha expirado' });
  }

  req.user = payload.id;
  next();
};

module.exports = authMiddleware;

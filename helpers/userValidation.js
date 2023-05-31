const { check, validationResult } = require('express-validator');

const userValidation = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  check('email').isEmail().withMessage('Email must be valid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array(),
      });
    }
    next();
  },
];

const actualizarUsuarioValidation = [
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  check('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  check('email').optional().isEmail().withMessage('Email must be valid'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array(),
      });
    }
    next();
  },
];

module.exports = { userValidation, actualizarUsuarioValidation };

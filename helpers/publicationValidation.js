const { check, validationResult } = require('express-validator');

const publicationValidation = [
  check('text')
    .isLength({ min: 1 })
    .withMessage('Text is required')
    .isLength({ max: 280 })
    .withMessage('Text must be less than 280 characters'),
  check('image').optional().isURL().withMessage('Image must be a valid URL'),
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

module.exports = { publicationValidation };

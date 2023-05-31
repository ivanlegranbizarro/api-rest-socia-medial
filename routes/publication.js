const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publication');
const authMiddleware = require('../helpers/authMiddleware');
const publicationValidation = require('../helpers/publicationValidation');

router.post(
  '/',
  [authMiddleware, publicationValidation.publicationValidation],
  publicationController.create
);

router.get('/', authMiddleware, publicationController.getPublications);
router.get(
  '/feed',
  authMiddleware,
  publicationController.publicationsFromFollowedUsers
);
router.get('/:id', authMiddleware, publicationController.getPublication);

module.exports = router;

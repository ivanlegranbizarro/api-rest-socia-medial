const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');
const authMiddleware = require('../helpers/authMiddleware');

router.post('/:id', authMiddleware, FollowController.follow);
router.post('/unfollow/:id', authMiddleware, FollowController.unfollow);
router.get('/following', authMiddleware, FollowController.getFollowingUsers);
router.get('/followed', authMiddleware, FollowController.getFollowedUsers);

module.exports = router;

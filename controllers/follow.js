const Follow = require('../models/follow');
const User = require('../models/user');

class FollowController {
  async follow(req, res) {
    const { user } = req;
    const { id } = req.params;

    try {
      const userToFollow = await User.findById(id);
      if (!userToFollow) {
        throw new Error('El usuario no existe');
      }

      const follow = await Follow.findOne({ user, followed: id });
      if (follow) {
        throw new Error('Ya sigues a este usuario');
      }

      const newFollow = new Follow({ user, followed: id });
      await newFollow.save();

      res.status(200).json({
        status: 'success',
        data: {
          follow: newFollow,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async unfollow(req, res) {
    const { user } = req;
    const { id } = req.params;

    try {
      const userToUnfollow = await User.findById(id);
      if (!userToUnfollow) {
        throw new Error('El usuario no existe');
      }
      const unfollow = await Follow.findOneAndDelete({ user, followed: id });
      if (!unfollow) {
        throw new Error('No sigues a este usuario');
      }

      res.status(200).json({
        status: 'success',
        data: {
          unfollow,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async getFollowingUsers(req, res) {
    const { user } = req;
    try {
      const followingUsers = await Follow.find({ user }).populate(
        'followed',
        'name _id'
      );
      res.status(200).json({
        status: 'success',
        data: {
          followingUsers,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async getFollowedUsers(req, res) {
    const { user } = req;

    try {
      const followedUsers = await Follow.find({ followed: user }).populate(
        'user',
        'name _id'
      );

      res.status(200).json({
        status: 'success',
        data: {
          followedUsers,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }
}

module.exports = new FollowController();

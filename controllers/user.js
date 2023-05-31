const User = require('../models/user');
const _ = require('lodash');
const comparePasswords = require('../helpers/comparePasswords');
const createToken = require('../helpers/jwtToken');

class UserController {
  async crearUsuario(req, res) {
    const { body } = req;
    const allowedFields = Object.keys(User.schema.paths);
    const receivedFields = _.pick(body, allowedFields);

    try {
      const userExists = await User.findOne({
        $or: [
          { email: receivedFields.email },
          { username: receivedFields.username },
        ],
      });

      if (userExists) {
        throw new Error('El usuario ya existe');
      }
      const user = await User.create(receivedFields);
      const userWithoutPassword = _.omit(user.toObject(), 'password');
      res.status(201).json({
        status: 'success',
        data: {
          user: userWithoutPassword,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
  }
  async obtenerUsuarios(req, res) {
    try {
      const { page, limit } = req.query;

      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;

      const count = await User.countDocuments();
      const users = await User.find()
        .select('-password -role -__v -email -created_at -image')
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      res.status(200).json({
        status: 'success',
        data: {
          users,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
  }

  async loginUsuario(req, res) {
    const { body } = req;
    const allowedFields = ['email', 'password'];
    const receivedFields = _.pick(body, allowedFields);

    const user = await User.findOne({ email: receivedFields.email });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email o contraseña incorrectos',
      });
    }

    const validPassword = comparePasswords(
      receivedFields.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email o contraseña incorrectos',
      });
    }

    const token = createToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        token,
      },
    });
  }

  async obtenerUsuario(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id).select('-password -__v');
      if (!user) {
        throw new Error('El usuario no existe');
      }

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async actualizarUsuario(req, res) {
    const userId = req.user;

    const { body } = req;
    const allowedFields = ['name', 'username', 'email', 'image'];
    const receivedFields = _.pick(body, allowedFields);

    try {
      const user = await User.findByIdAndUpdate(userId, receivedFields, {
        new: true,
        runValidators: true,
      }).select('-password -__v');

      if (!user) {
        throw new Error('El usuario no existe');
      }

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async subirImagen(req, res) {
    const { filename } = req.file;

    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!mimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 'fail',
        message: 'El archivo debe ser una imagen',
      });
    }

    try {
      const userId = req.user;

      const user = await User.findByIdAndUpdate(
        userId,
        { image: filename },
        { new: true, runValidators: false }
      ).select('-password -__v');

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  async eliminarUsuario(req, res) {
    const user = req.user;

    try {
      await User.findByIdAndDelete(user);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();

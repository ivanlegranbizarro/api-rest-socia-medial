const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userValidation = require('../helpers/userValidation');
const authMiddleware = require('../helpers/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

const upload = multer({ storage });

router.post('/', userValidation.userValidation, UserController.crearUsuario);

router.put(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  UserController.subirImagen
);

router.put(
  '/',
  [authMiddleware, userValidation.actualizarUsuarioValidation],
  UserController.actualizarUsuario
);
router.get('/', authMiddleware, UserController.obtenerUsuarios);
router.delete('/', authMiddleware, UserController.eliminarUsuario);
router.get('/:id', authMiddleware, UserController.obtenerUsuario);

router.post('/login', UserController.loginUsuario);

module.exports = router;

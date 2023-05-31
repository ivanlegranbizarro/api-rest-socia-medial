const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    enum: ['admin', 'user'],
    type: String,
    default: 'user',
  },
  image: {
    type: String,
    default: 'default.png',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

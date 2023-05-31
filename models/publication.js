const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Text is required'],
  },
  image: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;

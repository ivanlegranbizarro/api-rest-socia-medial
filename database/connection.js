const mongoose = require('mongoose');
require('dotenv').config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.mongoURI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo conectar a la base de datos');
  }
};

module.exports = connection;

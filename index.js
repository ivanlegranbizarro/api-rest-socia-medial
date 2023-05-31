// Importando dependencias
const connection = require('./database/connection');
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const followRouter = require('./routes/follow');
const publicationRouter = require('./routes/publication');

// Mensaje de bienvenida
console.log('Bienvenido a mi red social');

// Conectando a la base de datos
connection();

// Crear servidor

const app = express();

const port = process.env.PORT || 3000;

//Configurar cors

app.use(cors());

// Convertir a JSON

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/user', userRouter);
app.use('/api/follow', followRouter);
app.use('/api/publication', publicationRouter);

// Activar servidor

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

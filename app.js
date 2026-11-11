import express from 'express'
import booksRouter from './routers/books.js';

//Inizializzo express
const app = express();
const port = process.env.PORT || 3000;

//Middleware per interpretare JSON
app.use(express.json());

// Ruta base di HOME
app.get('/', (req, res) => {
  res.send('Benvenuto alla API della library con Express e Prisma');
});

//Registrazione il router di libri sotto il prefisso '/books'
app.use('/books', booksRouter);

//Avvio il server
app.listen(port, () => {
  console.log(`API Library in ascolto su http://localhost:${port}`);
});

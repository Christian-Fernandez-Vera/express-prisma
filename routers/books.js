import express from "express";
import prisma from "../lib/prisma.js";

//Inizializiamo router express
const router = express.Router();

//1. INDEX - Lista totale (GET/ books)
router.get("/", async (req, res) => {
  // res.send("Lista di tutti i libri (Index CRUD)");
  const { limit } = req.query;
  const take = limit ? Number(limit) : undefined;

  // Si mandano un limit no number es: ?limit=abc -> 400 Bad request
  if (limit !== undefined && (!Number.isInteger(take) || take <= 0)) {
    return res.status(400).json({
      error: "Parametro 'limit' deve essere un intero maggiore di 0",
    });
  }

  //Consultiamo i libri incluso id e name de su category, escludendo categoryId
  const books = await prisma.book.findMany({
    take,
    omit: {
      categoryId: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json(books);
});

//2. SHOW - Detaglio di un libro per ID (GET/ books/:id)
router.get("/:id", async (req, res) => {
  // const { id } = req.params;
  // res.send(`Dettaglio del libro con ID: ${id}`);

  const id = Number(req.params.id);
  // Validazione 1: verifichiamo che il ID sia un numero valido
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Errore ID Non Valido",
    });
  }

  // Cerchiamo l'libro unico e includiamo i dati della categoria
  const book = await prisma.book.findUnique({
    where: { id },
    omit: {
      categoryId: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Validazione 2: Si Prisma ritonra Null, l'libro non esiste nella DB
  if(!book){
    return res.status(404).json({
      error: "Libro non trovato",
    });
  }

  res.json(book);
});

//3. STORE - Creare un nuovo libro (POST / books)
router.post("/", (req, res) => {
  res.send("Creazione di un nuovo libro (Store CRUD)");
});

//4. UPDATE - Modificare un libro esistente (PUT / books/:id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Modifica del libro con ID: ${id}`);
});

//5. MODIFY - Aggiornare parzialmente un libro (PATCH / books/:id)
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Aggiornamento parziale del libro con ID: ${id}`);
});

//6. DESTROY - Eliminare un libro (DELETE / books/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Eliminazione del libro con ID: ${id}`);
});

//Esportiamo il router
export default router;

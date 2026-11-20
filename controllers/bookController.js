import prisma from "../lib/prisma";

//1. INDEX - Tutti i libri (GET / Book)
export async function index(req, res) {
  const { limit } = req.query;
  const take = limit !== undefined ? Number(limit) : undefined;

  // Validazione del query param 'limit'
  if (limit !== undefined && (!Number.isInteger(take) || take <= 0)) {
    return res.status(400).json({
      error: "Il parametro 'limit' deve essere un numero intero maggiore di 0",
    });
  }

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
}

//2. SHOW - Trova un libro por ID (GET /books/:id)
export async function show(req, res) {
  const id = Number(req.params.id);

  //validazione 1: formato dell'ID
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "ID del libro non valido",
    });
  }

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

  //Validazione 2: Esistenza in DB
  if(!book) {
    return res.status(400).json({
      error:"Libro non trovato",
    });
  }

  res.json(book);
}

//3. STORE - Creare un nuovo libro (POST /books)
export async function store(req, res) {
  const { title, description, author, price, isAvailable, categoryId } = req.body;

  // Validazione 1: Campi obbligatori
  if(!title || !author || price === undefined ||categoryId === undefined) {
    return res.status(400).json({
      error: "Campi obbligatori mancanti: title, author, price e categoryId",
    });
  }

  const parsedCategoryId = Number(categoryId);
  const parsedPrice = Number(price);

  //Validazione 2: Categoria Esiste
  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0 || Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({
      error: "Il prezzo o il categoryId non hanno un formato numero valido",
    });
  }
  

}
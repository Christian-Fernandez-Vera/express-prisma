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

  //Validazione 3: Verifica la FK category
  const categoryExists = await prisma.category.findUnique({
    where: { id: parsedCategoryId },
  });
  
  if (!categoryExists) {
    return res.status(400).json({
      error: "categoryId non valido: la categoria selezionata non esiste",
    });
  }

  const newBook = await prisma.book.create({
    data: {
      title,
      description,
      author,
      price: parsedPrice,
      isAvailable, // si è undefined, Prisma fa @default(true)
      categoryId: parsedCategoryId,
    },
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

  res.status(201).json(newBook);
}

//4. UPDATE - Aggiornare un libro (PUT/PATCH /books/:id)
export async function update(req, res) {
  const id = Number(req.params.id);

  //Validazione 1: formato dell'ID
  if(!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "ID del libro non valido",
    });
  }

  //Validazione 2: Verifica che il libro esista
  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if(!existingBook) {
    return res.status(404).json({
      error: "Libro non trovato",
    });
  }

  const { title, description, author, price, isAvailable, categoryId } = req.body;

  //Validazione 3: Campi facoltativi (tipo e valore)
let parsedCategoryId;
  if (categoryId !== undefined) {
    parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      return res.status(400).json({
        error: "Formato categoryId non valido",
      });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({
        error: "categoryId non valido: la categoria non esiste",
      });
    }
  } 

  // Validazione 4: Prisma ignora undefined
  const updatedBook = await prisma.book.update({
    where: { id },
    data: {
      title,
      description,
      author,
      price: parsedPrice,
      isAvailable,
      categoryId: parsedCategoryId,
    },
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

  res.json(updatedBook);
}
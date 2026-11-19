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
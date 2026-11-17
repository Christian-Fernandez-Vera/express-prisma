import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/index.js";

// Configurazione del adatadore MariaDB/MySQL con la URL fornita dal file .env
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniziando i seeding di category...");

  //1. Pulizia della tabella per evitare conflitti con @unique
  await prisma.category.deleteMany();

  //2. Lista base di category da inserire
  const categoryNames = [
    "Fantascienza",
    "Programazione & AI",
    "Thriller Psicologico",
    "Saggistica",
    "Romanzo Storico",
  ];

  //3. Transformiamo l'array di stringhe al formato [{ name: "..."}] e creamo in blocco
  await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
  });

  //4. Recuperiamo i registri creati da MySQL per verificare ID
  const createdCategories = await prisma.category.findMany();

  console.log("✅ Categories inserite corretamente");
  console.table(createdCategories);
}

// Esecuzione controllata con rilevamento degli errori e chiusura pulita della connessione
main()
  .catch((error) => {
    console.error("❌ Errore durante il seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
 }); 

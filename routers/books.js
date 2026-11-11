import express from "express";

//Inizializiamo router express
const router = express.Router();

//1. INDEX - Lista totale (GET/ books)
router.get("/", (req, res) => {
  res.send("Lista di tutti i libri (Index CRUD)");
});

//2. SHOW - Detaglio di un libro per ID (GET/ books/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Dettaglio del libro con ID: ${id}`);
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

import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/bookController.js";

const router = express.Router();

// 1. INDEX - Lista di tutti i libri
router.get("/", index);

// 2. SHOW - Dettaglio di un libro per ID
router.get("/:id", show);

// 3. STORE - Creazione di un nuovo libro
router.post("/", store);

// 4. UPDATE - Aggiornamento completa o parziale
router.patch("/:id", update);

// 5. DESTROY - Eliminazione di un libro
router.delete("/:id", destroy);

export default router;
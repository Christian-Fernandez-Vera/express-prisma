function errorsHandler(err, req, res, next) {
  console.error("Errore interno del server", err);

  res.status(500).json({
    error:"Internal Server Error",
    message: err.message,
  });
}

export default errorsHandler;
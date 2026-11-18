function notFound(req, res, next) {
  res.status(404).json({
    error: "Not Found",
    message: `La ruta ${req.originalUrl} non esiste in questa API`,
  });
}

export default notFound;

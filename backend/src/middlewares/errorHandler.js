export const errorHandler = (err, req, res, next) => {
  console.error("Express Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
  });
};

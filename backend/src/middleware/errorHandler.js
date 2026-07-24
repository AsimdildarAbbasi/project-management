const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: 'File size exceeds limit of 10MB',
      });
    }
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(process.process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

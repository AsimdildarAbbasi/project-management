const multer = require('multer');
const path = require('path');
const fs = require('fs');

const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx', '.zip'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const taskId = req.params.taskId;
    const uploadPath = path.join(__dirname, '../../uploads/tasks', String(taskId));
    
    // Create directory recursively if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error('File type not allowed. Allowed types: pdf, png, jpg, jpeg, docx, xlsx, zip');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single('file');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
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
      return res.status(err.statusCode || 400).json({
        error: 'Bad Request',
        message: err.message || 'File upload failed',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No file provided in request',
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;

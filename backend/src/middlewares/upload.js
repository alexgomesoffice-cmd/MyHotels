import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// File filter for image validation
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
  }
};

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Custom error handler for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE' || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size exceeds maximum limit of 5MB',
      });
    }
    return res.status(400).json({
      message: err.message || 'File upload failed',
    });
  } else if (err && err.message) {
    return res.status(400).json({
      message: err.message,
    });
  }
  next();
};

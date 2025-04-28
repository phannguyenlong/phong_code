import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only (jpg, jpeg, png, webp)!');
  }
}

// Set up multer upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
export const uploadImage = (req, res) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return a complete path that can be used directly by the frontend
    res.json({
      imageUrl: `/${req.file.path}`
    });
  });
};
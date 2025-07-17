
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for directory creation

// Create a temporary directory if it doesn't exist
const tempDir = './temp_uploads/';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Set storage engine for multer (temporary storage before Cloudinary upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir); // Store files temporarily in this directory
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file Type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

module.exports = upload;
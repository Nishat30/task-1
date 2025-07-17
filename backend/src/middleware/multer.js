const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const multer = require('multer');

    // Configure Cloudinary using environment variables
    // These environment variables MUST be set in your Vercel project settings
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Configure Cloudinary storage for Multer
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'leaderboard_avatars', // This is the folder name in your Cloudinary account
            format: async (req, file) => 'png', // Force image format (e.g., png, jpg)
            public_id: (req, file) => `avatar-${Date.now()}-${file.originalname.split('.')[0]}`, // Generate a unique public ID
            // Optional: Add transformations for resizing/cropping on upload
            transformation: [{ width: 150, height: 150, crop: 'fill', gravity: 'face' }]
        },
    });

    // Initialize Multer with Cloudinary storage
    const upload = multer({ storage: storage });

    module.exports = upload;
    
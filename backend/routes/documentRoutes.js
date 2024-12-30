const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const {
    uploadDocument,
    getUserDocuments,
    getDocument,
    deleteDocument
} = require('../controllers/documentController');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
        }
    }
});

// Routes
router.post('/upload', authenticateUser, upload.single('document'), uploadDocument);
router.get('/', authenticateUser, getUserDocuments);
router.get('/:id', authenticateUser, getDocument);
router.delete('/:id', authenticateUser, deleteDocument);

module.exports = router; 
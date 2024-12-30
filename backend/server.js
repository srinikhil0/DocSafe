require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const serviceAccount = require('./firebase-service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Initialize Google Cloud Storage
const storage = new Storage({
    credentials: serviceAccount,
    projectId: serviceAccount.project_id
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const documentRoutes = require('./routes/documentRoutes');
const sharingRoutes = require('./routes/sharingRoutes');

app.use('/api/documents', documentRoutes);
app.use('/api/sharing', sharingRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DocSafe API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.message === 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
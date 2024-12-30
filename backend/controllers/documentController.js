const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

// Upload document
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.file;
        const userId = req.user.uid;
        const fileName = `${userId}/${Date.now()}_${file.originalname}`;
        
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    originalName: file.originalname,
                    userId: userId,
                    uploadDate: new Date().toISOString()
                }
            }
        });

        blobStream.on('error', (error) => {
            console.error('Upload Error:', error);
            res.status(500).json({ message: 'Upload failed' });
        });

        blobStream.on('finish', async () => {
            // Make the file private
            await blob.makePrivate();

            // Save document metadata to Firestore
            const docRef = await admin.firestore().collection('documents').add({
                userId: userId,
                fileName: fileName,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                uploadDate: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });

            res.status(200).json({
                message: 'Upload successful',
                documentId: docRef.id
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Document Upload Error:', error);
        res.status(500).json({ message: 'Error uploading document' });
    }
};

// Get user documents
const getUserDocuments = async (req, res) => {
    try {
        const userId = req.user.uid;
        const snapshot = await admin.firestore()
            .collection('documents')
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .get();

        const documents = [];
        snapshot.forEach(doc => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(documents);
    } catch (error) {
        console.error('Get Documents Error:', error);
        res.status(500).json({ message: 'Error retrieving documents' });
    }
};

// Get document by ID
const getDocument = async (req, res) => {
    try {
        const userId = req.user.uid;
        const documentId = req.params.id;

        const docRef = await admin.firestore()
            .collection('documents')
            .doc(documentId)
            .get();

        if (!docRef.exists) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const documentData = docRef.data();
        if (documentData.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Generate signed URL for temporary access
        const file = bucket.file(documentData.fileName);
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 5 * 60 * 1000 // URL expires in 5 minutes
        });

        res.status(200).json({
            ...documentData,
            signedUrl
        });
    } catch (error) {
        console.error('Get Document Error:', error);
        res.status(500).json({ message: 'Error retrieving document' });
    }
};

// Delete document
const deleteDocument = async (req, res) => {
    try {
        const userId = req.user.uid;
        const documentId = req.params.id;

        const docRef = admin.firestore().collection('documents').doc(documentId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const documentData = doc.data();
        if (documentData.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Soft delete - update status to deleted
        await docRef.update({
            status: 'deleted',
            deletedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete Document Error:', error);
        res.status(500).json({ message: 'Error deleting document' });
    }
};

module.exports = {
    uploadDocument,
    getUserDocuments,
    getDocument,
    deleteDocument
}; 
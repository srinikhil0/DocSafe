const admin = require('firebase-admin');
const crypto = require('crypto');

// Generate a unique sharing number
const generateUniqueNumber = () => {
    // Generate a 6-digit number
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Business generates a unique number for document request
const generateSharingNumber = async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { businessId, documentType } = req.body;

        if (!businessId || !documentType) {
            return res.status(400).json({ message: 'Business ID and document type are required' });
        }

        const uniqueNumber = generateUniqueNumber();
        const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now

        console.log('Generated number:', uniqueNumber);
        console.log('Creating Firestore document...');

        // Store the sharing request in Firestore
        const docRef = await admin.firestore().collection('sharingRequests').add({
            businessId,
            documentType,
            uniqueNumber,
            expiryTime,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Firestore document created:', docRef.id);

        res.status(200).json({
            uniqueNumber,
            expiryTime,
            documentType
        });
    } catch (error) {
        console.error('Generate Sharing Number Error:', error);
        res.status(500).json({ message: 'Error generating sharing number', error: error.message });
    }
};

// User shares document using the unique number
const shareDocument = async (req, res) => {
    try {
        const { uniqueNumber, documentId } = req.body;
        const userId = req.user.uid;

        // Find the sharing request
        const sharingRequestSnapshot = await admin.firestore()
            .collection('sharingRequests')
            .where('uniqueNumber', '==', uniqueNumber)
            .where('status', '==', 'pending')
            .get();

        if (sharingRequestSnapshot.empty) {
            return res.status(404).json({ message: 'Invalid or expired sharing number' });
        }

        const sharingRequest = sharingRequestSnapshot.docs[0];
        const sharingData = sharingRequest.data();

        // Check if the number has expired
        if (sharingData.expiryTime < Date.now()) {
            await sharingRequest.ref.update({ status: 'expired' });
            return res.status(400).json({ message: 'Sharing number has expired' });
        }

        // Verify the document exists and belongs to the user
        const documentRef = await admin.firestore()
            .collection('documents')
            .doc(documentId)
            .get();

        if (!documentRef.exists || documentRef.data().userId !== userId) {
            return res.status(403).json({ message: 'Document not found or access denied' });
        }

        // Create a sharing record
        await admin.firestore().collection('documentShares').add({
            documentId,
            userId,
            businessId: sharingData.businessId,
            sharedAt: admin.firestore.FieldValue.serverTimestamp(),
            expiryTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours access
            status: 'active'
        });

        // Update the sharing request status
        await sharingRequest.ref.update({
            status: 'completed',
            documentId,
            userId
        });

        res.status(200).json({
            message: 'Document shared successfully',
            businessId: sharingData.businessId
        });
    } catch (error) {
        console.error('Share Document Error:', error);
        res.status(500).json({ message: 'Error sharing document' });
    }
};

// Get all active shares for a user
const getUserShares = async (req, res) => {
    try {
        const userId = req.user.uid;

        const sharesSnapshot = await admin.firestore()
            .collection('documentShares')
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .get();

        const shares = [];
        sharesSnapshot.forEach(doc => {
            shares.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(shares);
    } catch (error) {
        console.error('Get Shares Error:', error);
        res.status(500).json({ message: 'Error retrieving shares' });
    }
};

// Revoke document access
const revokeAccess = async (req, res) => {
    try {
        const userId = req.user.uid;
        const shareId = req.params.shareId;

        const shareRef = admin.firestore().collection('documentShares').doc(shareId);
        const share = await shareRef.get();

        if (!share.exists || share.data().userId !== userId) {
            return res.status(403).json({ message: 'Share not found or access denied' });
        }

        await shareRef.update({
            status: 'revoked',
            revokedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({ message: 'Access revoked successfully' });
    } catch (error) {
        console.error('Revoke Access Error:', error);
        res.status(500).json({ message: 'Error revoking access' });
    }
};

module.exports = {
    generateSharingNumber,
    shareDocument,
    getUserShares,
    revokeAccess
}; 
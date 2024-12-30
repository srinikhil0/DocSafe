const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
    generateSharingNumber,
    shareDocument,
    getUserShares,
    revokeAccess
} = require('../controllers/sharingController');

// Business routes
router.post('/generate-number', generateSharingNumber); // Business generates sharing number

// User routes (protected)
router.post('/share', authenticateUser, shareDocument); // User shares document using number
router.get('/shares', authenticateUser, getUserShares); // User gets their active shares
router.post('/revoke/:shareId', authenticateUser, revokeAccess); // User revokes access

module.exports = router; 
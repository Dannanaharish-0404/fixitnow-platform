const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { auth, isProvider } = require('../middleware/auth');

// Public routes
router.get('/', providerController.getProviders);
router.get('/:id', providerController.getProviderById);

// Protected provider routes
router.get('/me/profile', auth, isProvider, providerController.getMyProfile);
router.put('/me/profile', auth, isProvider, providerController.updateProfile);
router.get('/me/stats', auth, isProvider, providerController.getStats);

module.exports = router;

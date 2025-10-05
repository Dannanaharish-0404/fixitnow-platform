const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(auth, isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/providers', adminController.getAllProviders);
router.get('/bookings', adminController.getAllBookings);

router.put('/providers/:providerId/status', adminController.updateProviderStatus);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.delete('/reviews/:reviewId', adminController.deleteReview);

module.exports = router;

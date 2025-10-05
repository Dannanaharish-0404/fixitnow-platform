const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, isProvider } = require('../middleware/auth');

// Customer routes
router.post('/', auth, reviewController.createReview);

// Public routes
router.get('/provider/:providerId', reviewController.getProviderReviews);

// Provider routes
router.put('/:reviewId/respond', auth, isProvider, reviewController.respondToReview);

module.exports = router;

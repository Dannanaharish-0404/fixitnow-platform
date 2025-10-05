const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, isProvider } = require('../middleware/auth');

// Customer routes
router.post('/', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getMyBookings);
router.put('/:bookingId/cancel', auth, bookingController.cancelBooking);
router.get('/:bookingId', auth, bookingController.getBookingById);

// Provider routes
router.get('/provider/bookings', auth, isProvider, bookingController.getProviderBookings);
router.put('/provider/:bookingId/status', auth, isProvider, bookingController.updateBookingStatus);

module.exports = router;

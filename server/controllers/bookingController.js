const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      providerId,
      serviceType,
      description,
      scheduledDate,
      scheduledTime,
      location,
      estimatedPrice
    } = req.body;

    // Verify provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const booking = new Booking({
      customerId: req.userId,
      providerId,
      serviceType,
      description,
      scheduledDate,
      scheduledTime,
      location,
      estimatedPrice,
      status: 'pending'
    });

    await booking.save();

    // Populate customer and provider info
    await booking.populate('customerId', 'name email phone');
    await booking.populate('providerId');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.userId })
      .populate('providerId')
      .populate({
        path: 'providerId',
        populate: {
          path: 'userId',
          select: 'name phone email avatar'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get provider's bookings
exports.getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const { status } = req.query;
    let query = { providerId: provider._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone avatar address')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, providerNotes, finalPrice } = req.body;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify provider owns this booking
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    if (providerNotes) booking.providerNotes = providerNotes;
    if (finalPrice) booking.finalPrice = finalPrice;

    // Update provider's total bookings if completed
    if (status === 'completed') {
      await Provider.findByIdAndUpdate(provider._id, {
        $inc: { totalBookings: 1 }
      });
    }

    await booking.save();
    await booking.populate('customerId', 'name email phone');

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

// Cancel booking (customer)
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify customer owns this booking
    if (booking.customerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('customerId', 'name email phone avatar address')
      .populate({
        path: 'providerId',
        populate: {
          path: 'userId',
          select: 'name phone email avatar'
        }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

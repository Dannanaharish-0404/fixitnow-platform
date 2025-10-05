const Review = require('../models/Review');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, providerId, rating, comment } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const review = new Review({
      bookingId,
      customerId: req.userId,
      providerId,
      rating,
      comment
    });

    await review.save();

    // Update provider rating
    const reviews = await Review.find({ providerId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Provider.findByIdAndUpdate(providerId, {
      'rating.average': averageRating,
      'rating.count': reviews.length
    });

    await review.populate('customerId', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// Get reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const reviews = await Review.find({ providerId })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// Provider responds to review
exports.respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { responseText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify provider owns this review
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider || review.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.response = {
      text: responseText,
      createdAt: new Date()
    };

    await review.save();
    await review.populate('customerId', 'name avatar');

    res.json(review);
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({ message: 'Server error responding to review' });
  }
};

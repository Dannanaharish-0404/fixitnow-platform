const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const approvedProviders = await Provider.countDocuments({ isApproved: true });
    const pendingProviders = await Provider.countDocuments({ isApproved: false });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments();

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get top rated providers
    const topProviders = await Provider.find({ isApproved: true })
      .populate('userId', 'name email')
      .sort({ 'rating.average': -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalProviders,
        approvedProviders,
        pendingProviders,
        totalBookings,
        completedBookings,
        pendingBookings,
        totalReviews
      },
      recentBookings,
      topProviders
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get all providers (including unapproved)
exports.getAllProviders = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    if (search) {
      query.businessName = { $regex: search, $options: 'i' };
    }

    const providers = await Provider.find(query)
      .populate('userId', 'name email phone isActive')
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Server error fetching providers' });
  }
};

// Approve/reject provider
exports.updateProviderStatus = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { isApproved, isVerified } = req.body;

    const provider = await Provider.findByIdAndUpdate(
      providerId,
      { isApproved, isVerified },
      { new: true }
    ).populate('userId', 'name email');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Update provider status error:', error);
    res.status(500).json({ message: 'Server error updating provider status' });
  }
};

// Suspend/activate user
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Delete review (if inappropriate)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate provider rating
    const reviews = await Review.find({ providerId: review.providerId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Provider.findByIdAndUpdate(review.providerId, {
      'rating.average': averageRating,
      'rating.count': reviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

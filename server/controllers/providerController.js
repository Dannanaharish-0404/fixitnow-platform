const Provider = require('../models/Provider');
const User = require('../models/User');
const Review = require('../models/Review');

// Get all providers with filters
exports.getProviders = async (req, res) => {
  try {
    const { category, zipCode, search, sortBy = 'rating' } = req.query;
    
    let query = { isApproved: true };

    // Filter by category
    if (category && category !== 'all') {
      query.categories = category;
    }

    // Filter by zip code
    if (zipCode) {
      query['serviceArea.zipCodes'] = zipCode;
    }

    // Search by business name
    if (search) {
      query.businessName = { $regex: search, $options: 'i' };
    }

    // Sort options
    let sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions = { 'rating.average': -1 };
    } else if (sortBy === 'bookings') {
      sortOptions = { totalBookings: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const providers = await Provider.find(query)
      .populate('userId', 'name email phone avatar')
      .sort(sortOptions)
      .limit(50);

    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Server error fetching providers' });
  }
};

// Get single provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('userId', 'name email phone avatar address');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Get reviews
    const reviews = await Review.find({ providerId: provider._id })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ provider, reviews });
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({ message: 'Server error fetching provider' });
  }
};

// Get provider profile (for logged-in provider)
exports.getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId })
      .populate('userId', 'name email phone avatar address');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update provider profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      businessName,
      categories,
      services,
      serviceArea,
      workingHours,
      description,
      experience,
      certifications,
      photos
    } = req.body;

    const provider = await Provider.findOneAndUpdate(
      { userId: req.userId },
      {
        businessName,
        categories,
        services,
        serviceArea,
        workingHours,
        description,
        experience,
        certifications,
        photos
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone avatar');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(provider);
  } catch (error) {
    console.error('Update provider error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get provider statistics
exports.getStats = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const Booking = require('../models/Booking');
    
    const totalBookings = await Booking.countDocuments({ providerId: provider._id });
    const pendingBookings = await Booking.countDocuments({ 
      providerId: provider._id, 
      status: 'pending' 
    });
    const completedBookings = await Booking.countDocuments({ 
      providerId: provider._id, 
      status: 'completed' 
    });

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      rating: provider.rating,
      isVerified: provider.isVerified,
      isApproved: provider.isApproved
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

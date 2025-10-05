const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: String,
    required: true
  }],
  services: [{
    name: String,
    description: String,
    priceRange: {
      min: Number,
      max: Number
    }
  }],
  serviceArea: {
    zipCodes: [String],
    radius: Number // in miles
  },
  workingHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  description: {
    type: String,
    maxlength: 1000
  },
  experience: {
    type: Number, // years
    default: 0
  },
  certifications: [{
    name: String,
    issuer: String,
    year: Number,
    imageUrl: String
  }],
  photos: [{
    url: String,
    caption: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for location-based searches
providerSchema.index({ 'serviceArea.zipCodes': 1 });
providerSchema.index({ categories: 1 });
providerSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Provider', providerSchema);

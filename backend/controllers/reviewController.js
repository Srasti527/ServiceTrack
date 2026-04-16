import Review from '../models/Review.js';
import Service from '../models/Service.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/User
const createReview = async (req, res, next) => {
  try {
    const { serviceId, rating, comment } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (service.status !== 'completed') {
      res.status(400);
      throw new Error('Can only review completed services');
    }

    if (service.requestedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to review this service');
    }

    const alreadyReviewed = await Review.findOne({
      service: serviceId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Service already reviewed');
    }

    const review = await Review.create({
      rating: Number(rating),
      comment,
      service: serviceId,
      provider: service.acceptedBy,
      user: req.user._id,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific provider
// @route   GET /api/reviews/provider/:providerId
// @access  Private
const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
                                .populate('user', 'name')
                                .populate('service', 'title');
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific service
// @route   GET /api/reviews/service/:serviceId
// @access  Public or Private
const getServiceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name')
      .populate('provider', 'name');

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};


export { createReview, getProviderReviews, getServiceReviews };

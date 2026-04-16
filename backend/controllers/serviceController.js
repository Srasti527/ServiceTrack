import Service from '../models/Service.js';

// @desc    Create a service request
// @route   POST /api/services
// @access  Private/User
const createService = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const service = await Service.create({
      title,
      description,
      requestedBy: req.user._id,
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available pending services
// @route   GET /api/services/available
// @access  Private/Provider
const getAvailableServices = async (req, res, next) => {
  try {
    const services = await Service.find({ status: 'pending' }).populate('requestedBy', 'name email');
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get services requested by the logged in user
// @route   GET /api/services/my-requests
// @access  Private/User
const getMyRequests = async (req, res, next) => {
  try {
    const services = await Service.find({ requestedBy: req.user._id }).populate('acceptedBy', 'name email');
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get services assigned to the logged in provider
// @route   GET /api/services/my-tasks
// @access  Private/Provider
const getMyTasks = async (req, res, next) => {
  try {
    const services = await Service.find({ acceptedBy: req.user._id }).populate('requestedBy', 'name email');
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a pending service request
// @route   PUT /api/services/:id/accept
// @access  Private/Provider
const acceptService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (service.status !== 'pending') {
      res.status(400);
      throw new Error('Service is no longer available');
    }

    service.status = 'accepted';
    service.acceptedBy = req.user._id;

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
};

// @desc    Update service status (in-progress, completed)
// @route   PUT /api/services/:id/status
// @access  Private/Provider
const updateServiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    // Ensure the logged in provider is the one who accepted it
    if (service.acceptedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this service');
    }

    if (!['in-progress', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status update');
    }

    // Simple state machine logic
    if (service.status === 'completed') {
      res.status(400);
      throw new Error('Service is already completed');
    }

    service.status = status;
    const updatedService = await service.save();

    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
};

export {
  createService,
  getAvailableServices,
  getMyRequests,
  getMyTasks,
  acceptService,
  updateServiceStatus,
};

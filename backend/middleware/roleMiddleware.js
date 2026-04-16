const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Role ${req.user ? req.user.role : 'guest'} is not authorized to access this route`));
    }
    next();
  };
};

export { restrictTo };

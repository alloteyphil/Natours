const AppError = require('../utilities/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // search in keyValue to get the field
  const keys = Object.keys(err.keyPattern);
  const value = keys.map((key) => `${key}: ${err.keyValue[key]}`);
  const message = `Duplicate field value: "${value}". Please use an other value.`;
  return new AppError(message, 400);
};

const handleDuplicateReviewDB = () => {
  const message =
    'You have already created a review on this tour. You can only create one review per tour.';
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // rendered website (/ route)
  console.error('ERROR 🔥', err);

  return res.status(err.statusCode).render('error', {
    title: 'something went wrong',
    msg: err.message,
  });
};
const sendErrProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak error details
    // 1. log error
    console.error('ERROR 🔥', err);

    // 2. send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something is very wrong',
    });
  }
  // rendered website
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  // 1. log error
  console.error('ERROR 🔥', err);

  // 2. send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      // Mongoose bad ObjectID
      err = handleCastErrorDB(err);
    }

    // // Mongoose duplicate key/fields
    // if (err.code === 11000) {
    //   err = handleDuplicateFieldsDB(err);
    // }

    // Mongoose duplicate reviews
    if (err.code === 11000) {
      if (err.message.includes('tour_1_user_1')) {
        err = handleDuplicateReviewDB();
      } else {
        err = handleDuplicateFieldsDB(err);
      }
    }

    //Mongoose Validation errors
    if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err);
    }

    // JWT invalid signature
    if (err.name === 'JsonWebTokenError') {
      err = handleJWTError();
    }

    //JWT Token expires
    if (err.name === 'TokenExpiredError') {
      err = handleJWTExpiredError();
    }

    sendErrProd(err, req, res);
  }
};

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controller/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

// This simple module enforces HTTPS connections on any incoming GET and HEAD requests. In case of a non-encrypted HTTP request, express-sslify automatically redirects to an HTTPS address using a 301 permanent redirect. Any other type of request (e.g., POST) will fail with a 403 error message.
// if (process.env.NODE_ENV === 'production') app.use(enforce.HTTPS());

app.set('view engine', 'pug');
// path is used to prevent bugs, automatically takes care of slashes etc.
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES

// implement CORS (Cross Origin Resource Sharing)
// for simple requests: GET, HEAD, POST
app.use(cors());
// Access-Control-Allow_origin *
// for subdomains: ex: frontend is at natours.com & backend is at api.natours.com. this would allow the frontend to request from the backend:
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   })
// );

// for non-simple requests, allow for all routes
app.options('*', cors());
// non simple requests for specific routes
// app.options('/api/v1/tours/:id', cors());

// serving static files (all the static assets will be automatically provided in the folder called 'public')
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  }),
);

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // app.use(morgan('tiny'));
}

// limit requests from the same API
// allow 100 requests from a fixed IP per hour
// crashing or saving will reset the limit
const limiter = rateLimit({
  validate: { trustProxy: false },
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, try again in an hour',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhooksCheckout,
);

// body parser, reading data from the body to req.body
app.use(express.json({ limit: '10kb' }));
// reading data from the encoded url in account.pug to req.body based on name and email attributes [form-user-data(action='/submit-user-data' method='POST')]
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// data sanitization against NoSQL query injection
// {
//   "email": {"$gt": ""},
//   "password": "12345678"
// }
// without sanitization, simple query injection will result in a successful login
app.use(mongoSanitize());

// data sanitization against XSS
// {
//   "name": "<div id='bad-code'>Node</div>",
//   "email": "tester@gmail.com",
//   "password": "12345678",
//   "passwordConfirm": "12345678"
// }
// prevents from malicious html code
app.use(xss());

// prevent parameter pollution
// {{URL}}/api/v1/tours?sort=price&sort=duration
// will result in an error on this.queryString.sort inside APIFeatures.js as split() only works on strings but not on arrays
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  // console.log(req.headers);
  // m .log(x);
  // this middleware is called when there's a request. the error will be processed by global error handling middleware named errorController instead of uncaughtexception in server.js
  next();
});

//route
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // passing arg: express skips all the other middlewares as it knows there's error and moves to error handling middleware
  next(new AppError(`can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

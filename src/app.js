const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const setupSwagger = require('./config/swagger');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(globalLimiter);

setupSwagger(app);

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur GameVault API 🎮',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

app.use('/api', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable'
  });
});

app.use(errorHandler);

module.exports = app;
import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import connectDB from './db/index.js';
import TodoRoutes from './routes/todo.routes.js';

// Initialize Express app
const app = express();

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" 
        : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/todos', TodoRoutes);

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'CORS is working!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening for requests
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app',
  nodeEnv: process.env.NODE_ENV || 'development',
  CORS_ORIGIN:process.env.NODE_ENV
};

export default config;
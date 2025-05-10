const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'cameraStore';

let dbClient;

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Generic route handler for /api/{apiName}
// We will dynamically load routes from the /routes folder
const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes');

// Start server and connect to MongoDB
async function startServer() {
  try {
    dbClient = new MongoClient(mongoUrl);
    await dbClient.connect();
    
    console.log(`Connected to MongoDB database: ${dbName}`);
    
    app.locals.db = dbClient;

    fs.readdirSync(routesPath).forEach(file => {
      if (file.endsWith('.js')) {
        const routeName = path.basename(file, '.js');
        const routeModule = require(path.join(routesPath, file));
        
        if (routeModule && (typeof routeModule === 'function' || typeof routeModule.router === 'function')) {
          app.use(`/api/${routeName}`, routeModule);
          console.log(`Loaded route: /api/${routeName}`);
        } else {
          console.warn(`Could not load route ${routeName}: module.exports is not a function or a valid router.`);
        }
      }
    });

    app.get('/', (req, res) => {
      res.send('Backend server is running!');
    });

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB or start server:', err);
    process.exit(1);
  }
}

startServer();

// shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (dbClient) {
    await dbClient.close();
    console.log('MongoDB connection closed.');
  }
  process.exit(0);
}); 
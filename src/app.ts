import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes';
import { apiRateLimiter } from './middleware/api-rate-limiter';

// Create Express server
const app = express(); // New express instance
const port = 3001; // Port number


// Create a new Router instance


// Express configuration
app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(morgan('dev')); // Enable Morgan
app.use(express.json()); // <=== Enable JSON body parser
app.use(apiRateLimiter);

app.set('trust proxy', 1)
app.get('/ip', (request, response) => response.send(request.ip))
app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))

// Use routes
app.use('/', router);

// Start Express server
app.listen(port, () => {
  // Callback function when server is successfully started  
    console.log(`Server started at http://localhost:${port}`);
});

// Export Express app
export default app;
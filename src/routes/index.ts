import { Router } from 'express';
//import homeRouter from './home.routes';
import thirdwebRouter from './thirdweb.routes';
import { apiRateLimiter } from '../middleware/api-rate-limiter';

// Create a new Router instance
const router = Router();
router.use(apiRateLimiter);

// Mount the routers
router.use('/', thirdwebRouter);
//router.user('/home', homeRouter);



export default router;
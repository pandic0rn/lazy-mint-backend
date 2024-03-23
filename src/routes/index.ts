import { Router } from 'express';
//import homeRouter from './home.routes';
import thirdwebRouter from './thirdweb.routes';

// Create a new Router instance
const router = Router();

// Mount the routers
router.use('/', thirdwebRouter);
//router.user('/home', homeRouter);



export default router;
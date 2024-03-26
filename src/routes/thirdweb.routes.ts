import { Router, Request, Response } from 'express';
import { getDoAnything  } from '../controllers/thirdweb.controllers';
import { generateSignature } from '../controllers/generate-signature';
import { getNfts } from '../controllers/get-nfts';
import { mintWithSignature } from '../controllers/mint-with-sig';
import { validateMintWithSignatureRequest } from '../middleware/validations/mint-with-sig.validators';
import { authenticateKey } from '../middleware/authentication';
import { apiRateLimiter } from '../middleware/api-rate-limiter';

// New Router instance
const router = Router();
router.use(apiRateLimiter);
// Set the routes
router.get(
  '/', 
  authenticateKey,
  getDoAnything);

  router.get(
  '/getSign', 
  authenticateKey,
  generateSignature);

router.get(
  '/getNfts',
  authenticateKey, 
  getNfts);
//router.get('/mint', mintWithSignature);
//router.post('/mint', mintWithSignature);
router.post(
  '/mint', // path
  authenticateKey,
  validateMintWithSignatureRequest, // middleware
  mintWithSignature // controller
);

router.get('/ping', (req: Request, res: Response) => {
  return res.status(200).json({ "ping" : "pong" });
});


/*TODO check concept
// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});*/




/*router.get('/:id', getUserByIdController);
router.post(
  '/', // path
  validateUser, // middleware
  createUserController // controller
);
router.put(
  '/:id', // path
  validateUser, // middleware
  updateUserController // controller
);
router.delete('/:id', deleteUserController);*/

export default router;
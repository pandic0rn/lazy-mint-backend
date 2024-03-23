import { Router, Request, Response } from 'express';
import { getDoAnything  } from '../controllers/thirdweb.controllers';
import { generateSignature } from '../controllers/generate-signature';
import { getNfts } from '../controllers/get-nfts';
import { mintWithSignature } from '../controllers/mint-with-sig';
import { validateMintWithSignatureRequest } from '../utils/validations/mint-with-sig.validators';

// New Router instance
const router = Router();

// Set the routes
router.get('/', getDoAnything);
router.get('/sign', generateSignature);
router.get('/getNfts', getNfts);
//router.get('/mint', mintWithSignature);
//router.post('/mint', mintWithSignature);
router.post(
  '/mint', // path
  validateMintWithSignatureRequest, // middleware
  mintWithSignature // controller
);
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
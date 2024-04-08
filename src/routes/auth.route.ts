import Express, { Application } from 'express';
import AuthController from '../controllers/authController';

const route: Application = Express();

route.get('/api/auth/generate-public-key', AuthController.generatePublicKey);

export default route;

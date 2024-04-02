import Express, { Application } from 'express';
import AuthController from '../controllers/authController';

const route: Application = Express();

route.get('/api/auth/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'this is a test message',
    data: null
  });
});

route.get('/api/auth/generate-public-key', AuthController.generatePublicKey);

export default route;

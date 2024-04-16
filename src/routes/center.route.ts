import Express, { Application } from 'express';
import CenterController from '../controllers/centerController';

const route: Application = Express();

route.get('/api/center', CenterController.centers);

export default route;

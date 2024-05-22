import cors from 'cors';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Express, { Application } from 'express';
import routes from './api.route';
import internalRoutes from './apiInternal.route';
import DataSource from './database/dataSource';
import authProvider from './providers/auth.provider';

dotenv.config();

DataSource;

const app: Application = Express();
const port: string = process.env.PORT || '8080';

app.use(bodyParser.json());
app.use(authProvider.registerPassportPolicies());
app.use(cors({ origin: `${process.env.ALLOW_ORIGIN}`.split(',') }));

console.log('===================== Starting Server =====================');

app.use(routes);
app.use(internalRoutes);

app.listen(port, () => {
  console.log(`=============== Server running on port ${port} ===============`);
});

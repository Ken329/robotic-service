import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Express, { Application } from 'express';
import DataSource from './database/dataSource';
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';
import CenterRoute from './routes/center.route';
import { generateKeyPair } from './utils/helpers';
import authProvider from './providers/auth.provider';

dotenv.config();

DataSource;
generateKeyPair();

const app: Application = Express();
const port: string = process.env.PORT || '8080';

app.use(bodyParser.json());
app.use(authProvider.registerPassportPolicies());

console.log('===================== Starting Server =====================');

app.use(AuthRoute);
app.use(UserRoute);
app.use(CenterRoute);

app.listen(port, () => {
  console.log(`=============== Server running on port ${port} ===============`);
});

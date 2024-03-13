import * as dotenv from 'dotenv';
import Express, { Application } from 'express';
import AuthRoute from './routes/auth.route';

dotenv.config();

const app: Application = Express();
const port: string = process.env.PORT || '8080';

app.use('/api', AuthRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

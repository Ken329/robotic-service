import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Express, { Application } from 'express';
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';

dotenv.config();

const app: Application = Express();
const port: string = process.env.PORT || '8080';

app.use(bodyParser.json());

app.use(AuthRoute);
app.use(UserRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/* eslint-disable import/first */
require('module-alias/register');
import path from 'path';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import sequelize from '@initializers/sequelize';
import strongParams from '@middlewares/parameters';
import { morganLogger } from '@middlewares/morgan';
import routes from '@configs/routes';
import formidable from 'express-formidable';
import cronJobs from './jobs';

process.env.TZ = 'Asia/Bangkok';
const port = process.env.PORT || 3000;
const app = express();
app.use(compression());
// app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(formidable());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.options('*', cors());
app.use(morganLogger());
app.use(strongParams());

app.use('/no/api/v1', routes);

app.use((req, res) => {
  res.status(404).send({ url: `${req.path} not found` });
});

sequelize.authenticate().then(() => {
  app.listen(port, () => {
    console.log(`App is running localhost:${port}`);
    console.log('  Press CTRL-C to stop\n');
  });
  cronJobs();
});

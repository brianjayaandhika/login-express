import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import db from './database/db.js';
import movieRouter from './routes/movieRouter.js';
import userRouter from './routes/userRouter.js';
import responseHelpers from './helpers/responseHelper.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

db.sync()
  .then(() => {
    console.log('Database Connected!');
  })
  .catch(() => {
    console.log('Failed to connect!');
  });

app.use('/movies', movieRouter);
app.use('/user', userRouter);
// check emails in https://mailtrap.io/inboxes/2376809/messages/3658600755

app.use(express.static('temp/uploads'));

app.all('*', (req, res) => {
  responseHelpers(res, 404, null, 'API not found');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

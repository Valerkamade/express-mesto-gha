const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ERROR_NOT_FOUND } = require('./utils/constants');

const {
  login,
  createUser,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const responseError = require('./middlewares/response-error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то где-то пошло как-то не так' });
});
app.use(responseError);

app.listen(PORT);

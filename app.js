// Импорты пакетов
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

// Импорты самописных данных
const { ERROR_NOT_FOUND } = require('./utils/constants');
const {
  login,
  createUser,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const responseError = require('./middlewares/response-error');

// Назначить порт и создать приложение
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json()); // переводит входящие запросы в json
app.use(helmet()); // защита от веб-уязвимостей
app.use(cookieParser()); // для извлечения данных из куков

// Подключение к базе данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Запросы на авторизацию и регистрацию
app.post('/signin', login);
app.post('/signup', createUser);

// Проверка авторизации
app.use(auth);

// Запросы к серверу по роутам users и cards
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// .оповещение об ошибке по несуществующим роутам
app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то где-то пошло как-то не так' });
});

// Обработчики ошибок(celebrate и централизованный)
app.use(errors());
app.use(responseError);

// Прослушивание порта
app.listen(PORT);

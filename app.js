const express = require('express');
const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./errors/errors')

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64751a180fb5a5f20127fe08' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
})
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то где-то пошло как-то не так' })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
}) 
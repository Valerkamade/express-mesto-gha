[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

### Проект реализован в рамках учебы в **Яндекс Практикум** на специальности **"Веб-разработчик"**.
---
---

## Директории

* `/routes` — папка с файлами роутера  
* `/controllers` — папка с файлами контроллеров пользователя и карточки   
* `/models` — папка с файлами описания схем пользователя и карточки  
  
---  
## Запросы
*Users*

* `/users`	GET/POST - запрос/создание пользоваетлей;
* `/users/:userId`	GET - запрос пользователя по ***id***;
* `/users/me`	PATCH - изменение основных данных пользователя: ***name***, ***about***;
* `/users/me/avatar`	PATCH - изменение аватара пользователя: ***avatar***.

*Cards*
  
  * `/cards`	GET/POST - запрос/создание карточек;
  * `/cards/:cardId`	DELETE - удаление карточки по ***id***;
  * `/cards/:cardId/likes`	PUT/DELETE - добавление/удаление лайка карточки по ***id***.


---
## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

---
---
## Ссылка на репозиторий:
https://github.com/Valerkamade/express-mesto-gha
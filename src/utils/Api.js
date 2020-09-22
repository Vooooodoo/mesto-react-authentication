//* класс Api необходим для работы с API и выполнения запросов к серверу

// CLASS
class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _fetch(url, options) {
    //* если в опциях будет body, добавить свойство с преобразованием объекта JSON в строку,
    //* для будущей передачи на сервер
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }

    options.headers = this._headers;

    //* метод fetch создаёт запрос на сервер и возвращает его ответ,
    //* вторым аргументом передадим объект опций
    return fetch(this._baseUrl + url, options)
      .then((res) => {
        if (res.ok) { //* если запрос прошёл успешно
          //* асинхронный метод json читает ответ от сервера в формате json и возвращает промис,
          //* из которого можно достать нужные данные через обработчик then
          return res.json();
        }

        return Promise.reject(`${res.status}`); //* если сервер вернул ошибку, отклонили промис, чтобы перейти в блок catch
      });
  }

  //* метод для получения данных с сервера
  get(url) {
    return this._fetch(url, {
      method: 'GET',
    });
  }

  //* метод для обновления сущностей, уже существующих на сервере,
  //* например информации о пользователе
  patch(url, body) {
    //* при вызове метода, вместо параметра body подставим объект с данными,
    //* которые требуется передать на сервер
    return this._fetch(url, {
      method: 'PATCH',
      body,
    });
  }

  //* метод для для отправки данных на сервер
  post(url, body) {
    return this._fetch(url, {
      method: 'POST',
      body,
    });
  }

  //* метод для удаления ресурса с сервера
  delete(url) {
    return this._fetch(url, {
      method: 'DELETE',
    });
  }

  //* метод для полного обновления указанного ресурса
  put(url) {
    return this._fetch(url, {
      method: 'PUT',
    });
  }

  changeCardLikeStatus(cardId, isLiked) {
    return this._fetch(`/cards/likes/${cardId}`, {
      method: isLiked ? 'DELETE' : 'PUT',
    });
  }
}

// API INSTANCE
const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-12',
  headers: {
    authorization: 'da3ea697-f11c-42f5-89fc-193a981f7278',
    'Content-Type': 'application/json'
  },
});

export default api;

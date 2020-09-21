export const BASE_URL = 'https://auth.nomoreparties.co';

export function register (email, password) { //* функция для регистрации новых пользователей
  return fetch(`${BASE_URL}/signup`, { //* эндпоинт на стороне сервера
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }) //* запостили значения инпутов формы на сервер

  .then((res) => res.json()) //* получили объект, который содержит информацию об ответе и статус ответа

  .then((res) => res) //* получили объект, который содержит данные пользователя (которые он ввёл в форму регистрации), адрес запроса и уникальный подписанный JWT-токен

  .catch((error) => {
    alert('Ошибка. Запрос не выполнен.');
    console.log('Ошибка. Запрос не выполнен:', error);
  });
};

export function authorize (email, password) { //* функция для авторизации новых пользователей
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  .then((res) => res.json())

  .then((data) => {
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      return data;
    } //* если в полученном с сервера объекте есть свойство user - сохранить его jwt-токен в локальном хранилище браузера
  })

  .catch((error) => {
    alert('Ошибка. Запрос не выполнен.');
    console.log('Ошибка. Запрос не выполнен:', error);
  });
};

export function getContent(token) { //* функция для проверки токенов авторизованных пользователей, которые вернулись в приложение
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  .then((res) => res.json())

  .then((data) => data)

  .catch((error) => {
    alert('Ошибка. Запрос не выполнен.');
    console.log('Ошибка. Запрос не выполнен:', error);
  });
}

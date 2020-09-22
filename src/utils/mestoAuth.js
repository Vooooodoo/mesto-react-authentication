export const BASE_URL = 'https://auth.nomoreparties.co';

export function register(email, password) { //* функция для регистрации новых пользователей
  return fetch(`${BASE_URL}/signup`, { //* эндпоинт на стороне сервера
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }) //* запостили значения инпутов формы на сервер

    //* получим объект, который содержит информацию об ответе и статус ответа
    .then((res) => res.json())

    //* получим объект, который содержит данные пользователя (которые он ввёл в форму регистрации),
    //* адрес запроса и уникальный подписанный JWT-токен
    .then((res) => res);
}

export function authorize(email, password) { //* функция для авторизации новых пользователей
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

    .then((res) => res.json())

    .then((data) => {
      //* если в полученном с сервера объекте есть свойство token,
      //* сохранить его значени в локальном хранилище браузера
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        return data;
      }
    });
}

//* функция для проверки токенов авторизованных пользователей, которые вернулись в приложение
export function getContent(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

    .then((res) => {
      try {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 400) {
          throw new Error('Токен не передан или передан не в том формате');
        }
        if (res.status === 401) {
          throw new Error('Переданный токен некорректен');
        }
      } catch (error) {
        return error;
      }
    })

    .then((data) => data);
}

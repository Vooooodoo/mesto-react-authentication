export const BASE_URL = 'https://auth.nomoreparties.co';

export function register (email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }) //* запостили значения инпутов формы на сервер

  .then((res) => {
    return res.json();
  }) //* получили объект, который содержит информацию об ответе и статус ответа

  .then((res) => {
    return res;
  }) //* получили объект, который содержит данные пользователя (которые он ввёл в форму регистрации), адрес запроса и уникальный подписанный JWT-токен

  .catch((error) => console.log(error));
};



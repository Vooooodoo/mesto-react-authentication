import React from 'react';
import Authentication from './Authentication';
import * as mestoAuth from '../mestoAuth';

function Register() {
  function handleSubmit(evt) {
    evt.preventDefault();

    mestoAuth.register(email, password) //* аргументы с переменными состояния в которых значения инпутов формы
      .then((res) => {
        if (res) { //* если форма отправлена успешно, перенаправить пользователя на страницу авторизации
          setMessage({
            message: ''
          });

          history.push('/sign-in');
        } else {
          setMessage({
            message: 'Что-то пошло не так!'
          });
        }
      });
  }

  return (
    <Authentication
      title="Регистрация"
      btnText="Зарегистрироваться"
      subBtnText="Уже зарегистрированы?"
      linkText="Войти"
      linkRoute="/sign-in"
      handleSubmit={handleSubmit}
    />
  );
}

export default Register;
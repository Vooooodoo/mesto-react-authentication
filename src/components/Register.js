import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import Header from './Header';
import Authentication from './Authentication';
import * as mestoAuth from '../mestoAuth';

function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const history = useHistory();

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

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
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  return (
    <>
      <Header
        children={<Link to="/sign-in" className="header__link header__text">Войти</Link>}
      />
      <Authentication
        title="Регистрация"
        btnText="Зарегистрироваться"
        subBtnText="Уже зарегистрированы?"
        linkText="Войти"
        linkRoute="/sign-in"
        onSubmitButton={handleSubmit}
        onEmailInput={handleEmailChange}
        onPasswordInput={handlePasswordChange}
      />
    </>
  );
}

export default Register;

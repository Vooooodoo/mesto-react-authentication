import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import Header from './Header';
import Authentication from './Authentication';
import * as mestoAuth from '../utils/mestoAuth';

function Login(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isErrorTooltipOpen, setIsErrorTooltipOpen] = React.useState(false);

  const history = useHistory();

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    if (!email || !password) {
      return;
    }

    mestoAuth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail('');
          setPassword('');

          props.onLogin();
          history.push('/');
        }
      })

      .catch((error) => {
        setIsErrorTooltipOpen(true);
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  return (
    <>
      <Header
        children={<Link to="/sign-up" className="header__link header__text">Регистрация</Link>}
      />
      <Authentication
        title="Вход"
        btnText="Войти"
        subBtnText="Ещё не зарегистрированы?"
        linkText="Регистрация"
        linkRoute="/sign-up"
        onSubmitButton={handleSubmit}
        onEmailInput={handleEmailChange}
        onPasswordInput={handlePasswordChange}
      />
    </>
  );
}

export default Login;

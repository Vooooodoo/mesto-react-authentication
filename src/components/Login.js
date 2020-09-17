import React from 'react';
import Authentication from './Authentication';

function Login() {
  return (
    <Authentication
      title="Вход"
      btnText="Войти"
      subBtnText="Ещё не зарегистрированы?"
      linkText="Регистрация"
      linkRoute="/sign-up"
    />
  );
}

export default Login;
import React from 'react';
import Authentication from './Authentication';

function Login(props) {
  return (
    <Authentication
      title="Вход"
      btnText="Войти"
      subBtnText="Ещё не зарегистрированы?"
      linkText="Регистрация"
      linkRoute="/sign-up"
      onSubmitButton={props.onSubmitButton}
      onEmailInput={props.onEmailInput}
      onPasswordInput={props.onPasswordInput}
    />
  );
}

export default Login;

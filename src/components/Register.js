import React from 'react';
import Authentication from './Authentication';

function Register(props) {
  return (
    <Authentication
      title="Регистрация"
      btnText="Зарегистрироваться"
      subBtnText="Уже зарегистрированы?"
      linkText="Войти"
      linkRoute="/sign-in"
      onSubmitButton={props.onSubmitButton}
      onEmailInput={props.onEmailInput}
      onPasswordInput={props.onPasswordInput}
    />
  );
}

export default Register;

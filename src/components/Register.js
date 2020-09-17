import React from 'react';
import Authentication from './Authentication';

function Register() {
  return (
    <Authentication
      title="Регистрация"
      btnText="Зарегистрироваться"
      subBtnText="Уже зарегистрированы?"
      linkText="Войти"
      linkRoute="/sign-in"
    />
  );
}

export default Register;
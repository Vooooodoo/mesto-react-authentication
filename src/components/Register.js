import React from 'react';
import Authentication from './Authentication';

function Register(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmitButton(email, password);
  }

  return (
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
  );
}

export default Register;

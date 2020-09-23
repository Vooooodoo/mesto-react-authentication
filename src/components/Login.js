import React from 'react';
import Authentication from './Authentication';

function Login(props) {
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
      title="Вход"
      btnText="Войти"
      subBtnText="Ещё не зарегистрированы?"
      linkText="Регистрация"
      linkRoute="/sign-up"
      onSubmitButton={handleSubmit}
      onEmailInput={handleEmailChange}
      onPasswordInput={handlePasswordChange}
    />
  );
}

export default Login;

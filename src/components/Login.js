import React from 'react';
import Authentication from './Authentication';
import * as mestoAuth from '../mestoAuth';
import { useHistory } from 'react-router-dom';

function Login(props) {
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

    if (!email || !password){
      return;
    }

    mestoAuth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          setMessage({
            message: ''
          });
          setEmail('');
          setPassword('');

          props.onLogin();
          history.push('/mesto-react');
        }
      })

      .catch((error) => console.log(error)); //* запускается, если пользователь не найден
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
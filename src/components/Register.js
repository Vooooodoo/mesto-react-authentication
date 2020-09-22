import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import Header from './Header';
import Authentication from './Authentication';
import ErrorTooltip from './ErrorTooltip';
import * as mestoAuth from '../utils/mestoAuth';

function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isErrorTooltipOpen, setIsErrorTooltipOpen] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    function handleOverlayClick(evt) {
      if (evt.target.classList.contains('popup')) {
        closeErrorTooltip();
      }
    }

    document.addEventListener('click', handleOverlayClick);

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, [isErrorTooltipOpen]);

  React.useEffect(() => {
    function handleEsc(evt) {
      if (evt.key === 'Escape') {
        closeErrorTooltip();
      }
    }

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isErrorTooltipOpen]);

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    //* в качестве аргументов передадим переменные состояния, в которых значения инпутов формы
    mestoAuth.register(email, password)
      .then((res) => {
        //* если форма отправлена успешно, перенаправить пользователя на страницу авторизации
        if (res) {
          history.push('/sign-in');
        }
      })

      .catch((error) => {
        setIsErrorTooltipOpen(true);
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  function closeErrorTooltip() {
    setIsErrorTooltipOpen(false);
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
      <ErrorTooltip
        isOpen={isErrorTooltipOpen}
        onClose={closeErrorTooltip}
      />
    </>
  );
}

export default Register;

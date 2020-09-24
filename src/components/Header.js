import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../images/header__logo.svg';

function Header(props) {
  const { pathname } = useLocation();

  const linkText = `${pathname === '/sign-in' ? 'Регистрация' : 'Войти'}`;
  const linkPath = `${pathname === '/sign-in' ? '/sign-up' : '/sign-in'}`;

  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип Место Россия." />
      {props.loggedIn
        ? (<div>
            <p className="header__text">{props.userData}</p>
            <button className="header__button header__text" type="button" onClick={props.onSignOut}>Выйти</button>
          </div>)

        : (<Link to={linkPath} className="header__link header__text">{linkText}</Link>)
      }
    </header>
  );
}

export default Header;

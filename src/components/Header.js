import React from 'react';
import headerLogo from '../images/header__logo.svg';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип Место Россия." />
      {props.children}
    </header>
  );
}

export default Header;

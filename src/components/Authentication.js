import React from 'react';
import { Link  } from 'react-router-dom';

function Authentication(props) {
  return (
    <form className="authentication" onSubmit={props.onSubmitButton}>
      <h3 className="authentication__title">{props.title}</h3>
      <fieldset className="authentication__fieldset">
        <input className="authentication__input" type="email" onChange={props.onEmailInput} placeholder="Email" minLength="2" maxLength="40" required />
        <input className="authentication__input" type="password" onChange={props.onPasswordInput} placeholder="Пароль" minLength="2" maxLength="40" required />
      </fieldset>
      <button className="authentication__submit" type="submit">{props.btnText}</button>
      <div className="authentication__wrapper">
        <p className="authentication__text">{props.subBtnText}</p>
        <Link className="authentication__link" to={props.linkRoute}>{props.linkText}</Link>
      </div>
    </form>
  );
}

export default Authentication;

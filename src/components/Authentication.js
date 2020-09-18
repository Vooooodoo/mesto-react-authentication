import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Authentication(props) {
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

  return (
    <form className="authentication" onSubmit={props.handleSubmit}>
      <h3 className="authentication__title">{props.title}</h3>
      <fieldset className="authentication__fieldset">
        <input className="authentication__input" type="email" onChange={handleEmailChange} placeholder="Email" minLength="2" maxLength="40" required />
        <input className="authentication__input" type="password" onChange={handlePasswordChange} placeholder="Пароль" minLength="2" maxLength="40" required />
      </fieldset>
      <button className="authentication__submit" type="submit">{props.btnText}</button>
      <div className="authentication__wrapper">
        <p className="authentication__text">{props.subBtnText}</p>
        <Link to={props.linkRoute} className="authentication__link">{props.linkText}</Link>
      </div>
    </form>
  );
}

export default Authentication;
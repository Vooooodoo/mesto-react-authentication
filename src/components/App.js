import React from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  Link,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Footer from './Footer';
import UserAccount from './UserAccount';
import Register from './Register';
import Login from './Login';
import Spinner from './Spinner';
import * as mestoAuth from '../utils/mestoAuth';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const history = useHistory();

  function handleLogin() {
    setLoggedIn(true);
  }

  //* если у пользователя есть токен в localStorage, эта функция проверит валидность токена
  function checkToken() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      mestoAuth.getContent(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            setIsLoading(false);
            history.push('/');
          }
        })

        .catch((error) => {
          console.log('Ошибка. Запрос не выполнен:', error);
        });
    }
  }

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleLoginSubmit(evt) {
    evt.preventDefault();

    if (!email || !password) {
      return;
    }

    mestoAuth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail('');
          setPassword('');

          handleLogin();
          history.push('/');
        }
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  React.useEffect(() => {
    checkToken();
  }, [localStorage]);

  return (
    <>
      {isLoading
        ? <Spinner />
        : <Switch>
            <ProtectedRoute exact path="/" loggedIn={loggedIn} userData={userEmail} component={UserAccount} /> {/* создали защищённый маршрут и передадили несколько пропсов */}
            <Route path="/sign-up">
              <Register />
            </Route>
            <Route path="/sign-in">
              <Header children={<Link to="/sign-up" className="header__link header__text">Регистрация</Link>}/>
              <Login
                onSubmitButton={handleLoginSubmit}
                onEmailInput={handleEmailChange}
                onPasswordInput={handlePasswordChange}
              />
            </Route>
            <Route>
              {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />} {/* перенаправили пользователя на определённый путь в зависимости от статуса его авторизации */}
            </Route>
          </Switch>
      }
      <Footer />
    </>
  );
}

export default App;

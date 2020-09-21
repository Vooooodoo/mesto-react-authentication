import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Footer from './Footer';
import UserAccount from './UserAccount';
import Register from './Register';
import Login from './Login';
import * as mestoAuth from '../mestoAuth';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');

  const history = useHistory();

  function handleLogin() {
    setLoggedIn(true);
  }

  React.useEffect(() => {
    tokenCheck();
  }, [loggedIn]);

  function tokenCheck() { //* если у пользователя есть токен в localStorage, эта функция проверит валидность токена
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      mestoAuth.getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push('/mesto-react');
          }
        });
    }
  }

  return (
    <>
      <Header />
      <Switch>
        <ProtectedRoute path="/mesto-react" loggedIn={loggedIn} component={UserAccount} /> {/* создали защищённый маршрут и передадили несколько пропсов: path, loggedIn, component */}
        <Route path="/sign-up">
          <Register />
        </Route>
        <Route path="/sign-in">
          <Login onLogin={handleLogin}/>
        </Route>
        <Route>
          {<Redirect to={`/${loggedIn ? 'mesto-react' : 'sign-in'}`} />} {/* перенаправили пользователя на определённый путь в зависимости от статуса его авторизации */}
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;

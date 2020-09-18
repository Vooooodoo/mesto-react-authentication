import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Footer from './Footer';
import UserAccount from './UserAccount';
import Register from './Register';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  function handleLogin() {
    setLoggedIn(true);
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

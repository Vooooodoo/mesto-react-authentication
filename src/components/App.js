import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UserAccount from './UserAccount';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/mesto-react">
          <UserAccount />
        </Route>
        <Route path="/sign-up">
          <Register />
        </Route>
        <Route path="/sign-in">
          <Login />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;

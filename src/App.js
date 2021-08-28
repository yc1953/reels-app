import Login from './components/Login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Feed from './components/Feed';
import PrivateRoute from './privateAuth/privateRoute';
import { AuthContextProvider } from './contexts/AuthProvider';
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <PrivateRoute path='/' exact component={Feed}></PrivateRoute>
          <Route path='/login' component={Login}></Route>
          <Route path='/signup' component={Signup}></Route>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

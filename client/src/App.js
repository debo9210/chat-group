import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authAction';
import AuthComponent from './components/AuthComponent';
import './App.css';
import WelcomeChannel from './components/WelcomeChannel';
import store from './store';

//check for token
if (localStorage.jwtToken) {
  //set token to header auth
  setAuthToken(localStorage.jwtToken);

  //decode token and get user info and expiry time
  const decoded = jwt_decode(localStorage.jwtToken);

  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
}

function App() {
  return (
    <div className='App'>
      <Router>
        <Route path='/' exact component={AuthComponent} />
        <Route path='/welcome' exact component={WelcomeChannel} />
      </Router>
    </div>
  );
}

export default App;

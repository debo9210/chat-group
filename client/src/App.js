import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authAction';
import AuthComponent from './components/AuthComponent';
import './App.css';
import ChatPortal from './components/ChatPortal';
import store from './store';

const currentTime = Date.now() / 1000;
//check for token
if (localStorage.jwtToken) {
  //set token to header auth
  setAuthToken(localStorage.jwtToken);

  //decode token and get user info and expiry time
  const decoded = jwt_decode(localStorage.jwtToken);

  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  if (decoded.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
} else if (localStorage.socialAccessToken) {
  //set socialAccess token to header auth
  setAuthToken(localStorage.socialAccessToken);

  //set user and isAuthenticated
  const userDetails = JSON.parse(localStorage.socialUserDetails);
  store.dispatch(setCurrentUser(userDetails));

  if (userDetails.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser(userDetails.socialName));
    window.location.href = '/';
  }
}

function App() {
  return (
    <div className='App'>
      <Router>
        <Route path='/' exact component={AuthComponent} />
        <Route
          // path='/chat-portal'
          path='/chat-portal/:channelName'
          exact
          component={ChatPortal}
        />
      </Router>
    </div>
  );
}

export default App;

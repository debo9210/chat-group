import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    //apply token to every request
    axios.defaults.headers.common.Authorization = token;
  } else {
    //delete autgh headers
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;

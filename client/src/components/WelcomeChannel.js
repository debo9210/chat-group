import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authAction';

const WelcomeChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutUserHandler = () => {
    dispatch(logoutUser());
    history.push('/');
  };

  return (
    <div>
      <h1>welcome channel</h1>
      <a href='#' onClick={logoutUserHandler}>
        Log out
      </a>
    </div>
  );
};

export default WelcomeChannel;

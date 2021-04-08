import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutUser, socialLogin } from '../redux/actions/authAction';

const WelcomeChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { user } = useSelector((state) => state.currentUser);

  const logoutUserHandler = () => {
    if (user.socialName) {
      dispatch(logoutUser(user.socialName));
    } else {
      dispatch(logoutUser());
    }

    history.push('/');
  };

  useEffect(() => {
    dispatch(socialLogin());
  }, [dispatch]);

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

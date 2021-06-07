import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InputComponent from './InputComponent';
import { registerUser, loginUser } from '../redux/actions/authAction';
import { CREATE_USER_SUCCESS } from '../redux/constants';

const AuthComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showJoin, setShowJoin] = useState(false);
  const [photoImg, setPhotoImg] = useState('');

  const [userName, setUserName] = useState('');
  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picFileObj, setPicFilObj] = useState({});

  //   console.log(photoFile);

  const authHeadingRef = useRef(null);
  const authBtnRef = useRef(null);
  const spanMemberRef = useRef(null);
  const memberRef = useRef(null);

  const registerErrors = useSelector((state) => state.errorsObj);
  const { success } = useSelector((state) => state.registerUser);
  const { isAuthenticated, user } = useSelector((state) => state.currentUser);

  // console.log(registerErrors);

  const changeLoginType = (e) => {
    if (e.target.textContent === 'Sign Up') {
      e.target.parentElement.childNodes[0].textContent = 'Already a member?';
      e.target.textContent = 'Login';
      authHeadingRef.current.textContent = 'Join chat app community';
      authBtnRef.current.textContent = 'sign up';
      setShowJoin(true);
      setPhotoImg(null);
    } else if (e.target.textContent === 'Login') {
      e.target.parentElement.childNodes[0].textContent =
        'Don’t have an account yet?';
      e.target.textContent = 'Sign Up';
      authHeadingRef.current.textContent = 'Log in to your account';
      authBtnRef.current.textContent = 'log in';
      setShowJoin(false);
    }
  };

  const inputFileHandler = (e) => {
    let reader;
    if (e.target.files && e.target.files[0]) {
      reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = function () {
        setPhotoImg(reader.result);
      };
    }
    setPicFilObj(e.target.files[0]);
  };

  const authBtnHandler = (e) => {
    // console.log(e.target.textContent);
    e.preventDefault();
    const registerFormData = new FormData();
    registerFormData.append('name', userName);
    registerFormData.append('email', email);
    registerFormData.append('password', password);
    registerFormData.append('confirmPassword', confirmPassword);
    registerFormData.append('imageUpload', picFileObj);

    if (e.target.textContent === 'sign up') {
      dispatch(registerUser(registerFormData));
    }

    const userData = {
      email,
      password,
    };

    if (e.target.textContent === 'log in') {
      dispatch(loginUser(userData));
    }
  };

  useEffect(() => {
    if (success) {
      const inputsDisplay = document.querySelectorAll('.InputDisplay');
      for (let i = 0; i < inputsDisplay.length; i++) {
        inputsDisplay[i].value = '';
      }
      memberRef.current.innerText = '';
      authHeadingRef.current.textContent = 'Log in to your account';
      authBtnRef.current.textContent = 'log in';
      setShowJoin(false);
    }

    if (isAuthenticated) {
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: false,
      });
      history.push(`/chat-portal/${'welcome'}`);
      // history.push(`/chat-portal`);
    }
  }, [success, isAuthenticated, dispatch, history, user]);

  return (
    <div>
      <h1 className='AuthComponentHeading'>Welcome to Chat App</h1>
      <div className='Auth'>
        <div className='AuthContainer'>
          <h3 className='AuthHeading' ref={authHeadingRef}>
            Log in to your account
          </h3>
          <form onSubmit={authBtnHandler}>
            {showJoin && (
              <InputComponent
                inputName='Your name'
                placeholder='Enter name'
                inputType='text'
                iconType='person'
                errorMsg={registerErrors.name}
                inputHandler={(e) => setUserName(e.target.value)}
                name='Name'
              />
            )}

            <InputComponent
              inputName='Email address'
              placeholder='Email address'
              inputType='email'
              iconType='mail'
              errorMsg={registerErrors.email}
              inputHandler={(e) => setUserEmail(e.target.value)}
              name='email'
            />

            <InputComponent
              inputName='Password'
              placeholder='Enter password'
              inputType='password'
              iconType='lock'
              errorMsg={registerErrors.password}
              inputHandler={(e) => setUserPassword(e.target.value)}
            />
            {showJoin && (
              <InputComponent
                inputName='Confirm password'
                placeholder='Confirm password'
                inputType='password'
                iconType='lock'
                errorMsg={registerErrors.confirmPassword}
                inputHandler={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {showJoin && (
              <div className='AddPhotoParent'>
                <div className='AddPhotoContainer'>
                  <div
                    className='AddPhoto'
                    style={{
                      backgroundImage: `url(${photoImg ? photoImg : null})`,
                    }}
                  >
                    <i className='material-icons'>photo_camera</i>
                  </div>
                  <div className='PhotoLabel'>
                    <label>
                      <input
                        type='file'
                        id=''
                        style={{ visibility: 'hidden' }}
                        onChange={inputFileHandler}
                      />
                      Add Photo
                    </label>
                  </div>
                </div>
                <small className='ErrorMsg'>
                  {registerErrors.imageUpload
                    ? registerErrors.imageUpload
                    : null}
                </small>
              </div>
            )}

            <div className='ButtonContainer'>
              <button onClick={authBtnHandler} ref={authBtnRef}>
                log in
              </button>
            </div>
          </form>

          <div className='LoginSwitchContainer'>
            <p ref={memberRef}>
              Don’t have an account yet?{' '}
              <span onClick={changeLoginType} ref={spanMemberRef}>
                Sign Up
              </span>
            </p>
          </div>
        </div>
        <div className='CopyRightContainer'>
          <small>created by debo9210</small>
          <small>devChallenges.io</small>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;

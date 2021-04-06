import React, { useRef, useState } from 'react';
import InputComponent from './InputComponent';
import GoogleLogo from '../svg/Google.svg';
import FacebookLogo from '../svg/Facebook.svg';
import TwitterLogo from '../svg/Twitter.svg';
import GithubLogo from '../svg/Github.svg';

const AuthComponent = () => {
  const [showJoin, setShowJoin] = useState(true);
  const [photoImg, setPhotoImg] = useState('');

  //   console.log(photoFile);

  const authHeadingRef = useRef(null);
  const authBtnRef = useRef(null);

  const changeLoginType = (e) => {
    if (e.target.textContent === 'Login') {
      e.target.parentElement.childNodes[0].textContent =
        'Don’t have an account yet?';
      e.target.textContent = 'Sign Up';
      authHeadingRef.current.textContent = 'Log in to your account';
      authBtnRef.current.textContent = 'log in';
      setShowJoin(false);
      setPhotoImg(null);
    } else if (e.target.textContent === 'Sign Up') {
      e.target.parentElement.childNodes[0].textContent = 'Already a member?';
      e.target.textContent = 'Login';
      authHeadingRef.current.textContent = 'Join chat app community';
      authBtnRef.current.textContent = 'sign up';
      setShowJoin(true);
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
    // setFileObj(e.target.files[0]);
  };

  return (
    <div className='Auth'>
      <div className='AuthContainer'>
        <h3 className='AuthHeading' ref={authHeadingRef}>
          Join chat app community
        </h3>
        {showJoin && (
          <InputComponent
            inputName='Your name'
            placeholder='Enter name'
            inputType='text'
            iconType='person'
          />
        )}

        <InputComponent
          inputName='Email address'
          placeholder='Email address'
          inputType='email'
          iconType='mail'
        />

        <InputComponent
          inputName='Password'
          placeholder='Enter password'
          inputType='password'
          iconType='lock'
        />
        {showJoin && (
          <InputComponent
            inputName='Confirm password'
            placeholder='Confirm password'
            inputType='password'
            iconType='lock'
          />
        )}

        {showJoin && (
          <div className='AddPhotoContainer'>
            <div
              className='AddPhoto'
              style={{ backgroundImage: `url(${photoImg ? photoImg : null})` }}
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
        )}

        <div className='ButtonContainer'>
          <button ref={authBtnRef}>sign up</button>
        </div>

        <div className='SocialLoginContainer'>
          <p>or continue with these social profile</p>
          <div className='SocialLogin'>
            <img src={GoogleLogo} alt='google' />
            <img src={FacebookLogo} alt='facebook' />
            <img src={TwitterLogo} alt='twitter' />
            <img src={GithubLogo} alt='github' />
          </div>
        </div>

        <div className='LoginSwitchContainer'>
          <p>
            Already a member? <span onClick={changeLoginType}>Login</span>
          </p>
        </div>
      </div>
      <div className='CopyRightContainer'>
        <small>created by debo9210</small>
        <small>devChallenges.io</small>
      </div>
    </div>
  );
};

export default AuthComponent;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutUser, socialLogin } from '../redux/actions/authAction';
import {
  joinChannel,
  getChannelMembers,
} from '../redux/actions/joinChannelAction';
import noPhoto from '../svg/noProfilePhoto.png';
// eslint-disable-next-line
import Loader from './Loader';
import CreateChannel from './CreateChannelComponent';
import '../css/chatPortal.css';

const ChatPortal = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [channelNames] = useState([
    'front-end developers',
    'random',
    'back-end',
    'cats and dogs',
    'welcome',
  ]);
  const [allChannels, setAllChannels] = useState(true);
  const [channelsDetails, setChannelDetails] = useState(false);
  const [channelName, setChannelName] = useState('');

  const { user, isAuthenticated } = useSelector((state) => state.currentUser);

  // eslint-disable-next-line
  const { members, loading } = useSelector((state) => state.channelMembers);

  const socialConnect = useSelector((state) => state.socialConnect);

  // console.log(members);
  // console.log(channelMembers);

  const userMenuRef = useRef(null);
  const createChannelRef = useRef(null);
  const chatPortalRef = useRef(null);

  const logoutUserHandler = () => {
    if (user.socialName) {
      dispatch(logoutUser(user.socialName));
    } else {
      dispatch(logoutUser());
    }

    history.push('/');
  };

  const openMenuHandler = (e) => {
    if (e.target.textContent === 'keyboard_arrow_down') {
      e.target.textContent = 'keyboard_arrow_up';
      userMenuRef.current.style.display = 'block';
    } else {
      e.target.textContent = 'keyboard_arrow_down';
      userMenuRef.current.style.display = 'none';
    }
  };

  const showChannelHandler = (e) => {
    let channelName = e.target.childNodes[1].textContent;
    setChannelName(channelName);
    setAllChannels(false);
    setChannelDetails(true);

    const userDetails = {
      id: user.id,
      channelName: channelName,
    };
    dispatch(joinChannel(userDetails));

    setTimeout(() => {
      dispatch(getChannelMembers());
    }, 2000);
  };

  const allChannelsHandler = () => {
    setAllChannels(true);
    setChannelDetails(false);
  };

  const createChannelHandler = () => {
    createChannelRef.current.style.display = 'block';
    chatPortalRef.current.style.opacity = '0.5';
  };

  document.body.addEventListener('click', (e) => {
    if (e.target.className === 'ChatDisplayContainer') {
      createChannelRef.current.style.display = 'none';
      chatPortalRef.current.style.opacity = '1';
    }
  });

  useEffect(() => {
    // dispatch(getChannelMembers());

    if (!isAuthenticated) {
      history.push('/');
    }

    if (socialConnect.status === 'connected') {
      dispatch(socialLogin());
    }
  }, [dispatch, socialConnect, history, isAuthenticated]);

  return (
    <>
      <div className='ChatPortalContainer' ref={chatPortalRef}>
        <div className='ChannelsContainer'>
          {allChannels && (
            <>
              <div className='ChannelsHeadingContainer'>
                <h3 className='ChannelsHeading'>channels</h3>
                <i
                  className='material-icons AddIcon'
                  title='create channel'
                  onClick={createChannelHandler}
                >
                  add
                </i>
              </div>

              <div className='ChannelDetailsContainer'>
                <div className='SearchInputGroup'>
                  <i className='material-icons'>search</i>
                  <input type='text' placeholder='search' />
                </div>

                <div className='ChannelDetails'>
                  <ul>
                    {channelNames.map((name, i) => (
                      <li key={i} onClick={showChannelHandler}>
                        <div className='NameAbbr'>
                          <span>
                            {name.split(',')[0].split(' ')[0].split('')[0]}
                          </span>
                          <span>
                            {name.split(',')[0].split(' ')[1]
                              ? name.split(',')[0].split(' ')[1].split('')[0]
                              : null}
                          </span>
                        </div>
                        {name.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {channelsDetails && (
            <>
              <div className='ChannelsHeadingContainer AllChannelsContainer'>
                <i
                  className='material-icons ArrowBackIcon'
                  onClick={allChannelsHandler}
                >
                  arrow_back_ios
                </i>
                <h3 className='ChannelsHeading AllChannelHeading'>
                  All channels
                </h3>
              </div>

              <div className='ChannelDetailsContainer'>
                <h4 className='ChannelNameHeading'>{channelName}</h4>
                <p className='ChannelAbout'>
                  Pellentesque sagittis elit enim, sit amet ultrices tellus
                  accumsan quis. In gravida mollis purus, at interdum arcu
                  tempor non
                </p>
                <h4 className='ChannelNameHeading'>Members</h4>

                {/* {!loading && (
                
              )} */}
                <div className='ChannelMembers'>
                  {/* {loading && <Loader />} */}
                  {members
                    ? members
                        .filter((member) => {
                          return member.channelJoined.includes(
                            channelName.toLowerCase()
                          );
                        })
                        .map((member, i) => (
                          <div key={i} className='Members'>
                            <div
                              className='MemberPhoto'
                              style={{
                                backgroundImage: `url(${member.profileImage})`,
                              }}
                            ></div>
                            <p className='MemberName UserName'>{member.name}</p>
                          </div>
                        ))
                    : null}
                </div>
              </div>
            </>
          )}

          <div className='UserMenu' ref={userMenuRef}>
            <div className='MenuOption'>
              <i className='material-icons'>account_circle</i>
              <p className='OptionType'>my profile</p>
            </div>

            <div className='MenuOption'>
              <i className='material-icons'>terrain</i>
              <p className='OptionType'>tweeter</p>
            </div>

            <hr />

            <div className='MenuOption MenuLogout'>
              <i className='material-icons'>exit_to_app</i>
              <p className='OptionType' onClick={logoutUserHandler}>
                logout
              </p>
            </div>
          </div>

          <div className='UserDisplayContainer'>
            <div
              className='ProfilePhoto'
              style={{
                backgroundImage: `url(${
                  !user.profilePhoto || user.profilePhoto === null
                    ? noPhoto
                    : user.profilePhoto
                })`,
              }}
            ></div>
            <p className='UserName'>{user.name}</p>
            <i
              className='material-icons ArrowDownIcon'
              onClick={openMenuHandler}
            >
              keyboard_arrow_down
            </i>
          </div>
        </div>

        <div className='ChatDisplayContainer'>
          <h1>Chat Display</h1>
        </div>
      </div>
      <CreateChannel createChannelRef={createChannelRef} />
    </>
  );
};

export default ChatPortal;

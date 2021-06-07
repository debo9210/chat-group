import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearErrors, logoutUser } from '../redux/actions/authAction';
import {
  joinChannel,
  getChannelMembers,
  createChannel,
  getChannels,
} from '../redux/actions/channelAction';
// eslint-disable-next-line
import { saveChatMessages } from '../redux/actions/chatMessagesAction';
// eslint-disable-next-line
import noPhoto from '../svg/noProfilePhoto.png';
import ChannelComponent from './ChannelComponent';
import ChatDisplayComponent from './ChatDisplayComponent';
// eslint-disable-next-line
import Loader from './Loader';
import CreateChannel from './CreateChannelComponent';
import '../css/chatPortal.css';
import { RESET_CREATE_CHANNEL } from '../redux/constants';
// eslint-disable-next-line
import moment from 'moment';
import { socket } from '../utils/socketConnection';

const ChatPortal = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [allChannels, setAllChannels] = useState(true);
  const [channelsDetails, setChannelsDetails] = useState(false);
  const [channelName, setChannelName] = useState('WELCOME');
  const [channelDesc, setChannelDesc] = useState('');
  const [createChannelName, setCreateChannelName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [msgObj, setMsgObj] = useState({});

  // const [saveMsgs, setSaveMsgs] = useState(true);

  const { user, isAuthenticated } = useSelector((state) => state.currentUser);

  const { allChannels: ALL_CHANNELS } = useSelector(
    (state) => state.getChannels
  );

  const { members } = useSelector((state) => state.channelMembers);

  const socialConnect = useSelector((state) => state.socialConnect);

  const createChannelErrors = useSelector((state) => state.errorsObj);

  const { success } = useSelector((state) => state.createChannel);

  // console.log(loading, success);

  const userMenuRef = useRef(null);
  const createChannelRef = useRef(null);
  const chatPortalRef = useRef(null);
  const createChannelInputRef = useRef(null);
  const createChannelTextAreaRef = useRef(null);
  const newMsgRef = useRef(null);
  const chatPanelRef = useRef(null);

  let channelAbout;
  if (ALL_CHANNELS) {
    channelAbout = ALL_CHANNELS.filter((channel) => {
      return channel.channelName.toLowerCase() === channelName.toLowerCase();
    }).map((channel, i) => (
      <div key={i}>
        <h4 className='ChannelNameHeading'>{channel.channelName}</h4>
        <p className='ChannelAbout'>{channel.channelDesc}</p>
      </div>
    ));
  }

  const logoutUserHandler = () => {
    dispatch(logoutUser(user.id));
    history.push('/');
  };

  const openMenuHandler = (e) => {
    const userMenu = document.querySelector('.UserMenu');
    if (e.target.textContent === 'keyboard_arrow_down') {
      e.target.textContent = 'keyboard_arrow_up';
      userMenuRef.current.style.display = 'block';
      userMenu.style.display = 'block';
    } else {
      e.target.textContent = 'keyboard_arrow_down';
      userMenuRef.current.style.display = 'none';
      userMenu.style.display = 'none';
    }
  };

  const showChannelHandler = (e) => {
    // if(e.target.childNodes[1].textContent === channelName) return
    // setSaveMsgs(true);
    let channelName = e.target.childNodes[0].textContent;
    setChannelName(channelName);
    setAllChannels(false);
    setChannelsDetails(true);

    const userDetails = {
      id: user.id,
      channelName: channelName,
    };

    const JOIN_CHANNEL = user.channelJoined.find(
      (joined) => joined === channelName.toLowerCase()
    );

    if (JOIN_CHANNEL === undefined) {
      dispatch(joinChannel(userDetails));
    }

    setTimeout(() => {
      dispatch(getChannelMembers());
    }, 2000);
    history.push(`/chat-portal/${channelName.toLowerCase()}`);
    // socket.disconnect();
  };

  const allChannelsHandler = () => {
    setAllChannels(true);
    setChannelsDetails(false);
  };

  const showCreateChannel = () => {
    createChannelRef.current.style.display = 'block';
    chatPortalRef.current.style.opacity = '0.5';
  };

  document.body.addEventListener('click', (e) => {
    // console.log(e.target.className);
    if (
      e.target.className === 'ChatDisplayContainer' ||
      e.target.className === 'ChatPanelContainer' ||
      e.target.className === 'ChannelDetails' ||
      e.target.className === 'UserMessageContainer' ||
      e.target.className === 'Month' ||
      e.target.className === 'ChatMsg' ||
      e.target.className === 'ChatMonth' ||
      e.target.className === 'UserMessage'
    ) {
      // console.log('yea');
      createChannelRef.current.style.display = 'none';
      chatPortalRef.current.style.opacity = '1';
    }

    if (createChannelErrors.channelName || createChannelErrors.channelDesc) {
      dispatch(clearErrors());
    }
  });

  const inputValueHandler = (e) => {
    setCreateChannelName(e.target.value);
  };

  const textAreaValueHandler = (e) => {
    setChannelDesc(e.target.value);
  };

  const createChannelHandler = (e) => {
    const channelDetails = {
      channelName: createChannelName,
      channelDesc,
      userID: user.id,
    };
    dispatch(createChannel(channelDetails));

    setTimeout(() => {
      dispatch(getChannels());
    }, 2000);
  };

  const newMessageHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMsgHandler = (e) => {
    // console.log(newMessage);
    e.preventDefault();
    newMsgRef.current.value = '';

    // emmiting chat msg to server
    if (socket) {
      socket.emit('chatMessage', newMessage);
    }
    newMsgRef.current.focus();
    // setSaveMsgs(true);
    // document.querySelector('.ChatPanelContainer').scrollTop =
    //   document.querySelector('.ChatPanelContainer').scrollHeight;
  };

  useEffect(() => {
    setTimeout(() => {
      if (success) {
        createChannelRef.current.style.display = 'none';
        chatPortalRef.current.style.opacity = '1';
        createChannelInputRef.current.value = '';
        createChannelTextAreaRef.current.value = '';
        setCreateChannelName('');
        setChannelDesc('');
        dispatch({ type: RESET_CREATE_CHANNEL });
      }
    }, 2000);
  }, [dispatch, success]);

  useEffect(() => {
    socket.on('message', (message) => {
      // setSaveMsgs(true);
      // console.log(message);
      // setSaveMsgs(true);
      setMsgObj(message);

      if (Object.keys(message).length !== 0) {
        dispatch(
          saveChatMessages(
            history.location.pathname.split('/')[2].toUpperCase(),
            message
          )
        );
      }

      setMsgObj({});
    });
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', {
      username: user.name,
      channelName: history.location.pathname.split('/')[2],
      // channelName: channelName,
      userPhoto: user.profilePhoto,
    });
  }, [channelName, user, history]);

  useEffect(() => {
    setChannelName('WELCOME');
    dispatch(getChannelMembers());

    if (!isAuthenticated) {
      history.push('/');
    }

    if (isAuthenticated) {
      if (window.location.reload) {
        history.push(`/chat-portal/welcome`);
      }
    }

    dispatch(getChannels());
  }, [dispatch, socialConnect, history, isAuthenticated, user]);

  return (
    <>
      <div className='ChatPortalContainer' ref={chatPortalRef}>
        <ChannelComponent
          allChannels={allChannels}
          showCreateChannel={showCreateChannel}
          ALL_CHANNELS={ALL_CHANNELS}
          showChannelHandler={showChannelHandler}
          channelsDetails={channelsDetails}
          allChannelsHandler={allChannelsHandler}
          channelAbout={channelAbout}
          members={members}
          channelName={channelName}
          userMenuRef={userMenuRef}
          logoutUserHandler={logoutUserHandler}
          user={user}
          openMenuHandler={openMenuHandler}
        />

        <ChatDisplayComponent
          channelName={channelName}
          newMessageHandler={newMessageHandler}
          sendMsgHandler={sendMsgHandler}
          newMsgRef={newMsgRef}
          channels={ALL_CHANNELS}
          chatPanelRef={chatPanelRef}
          msgObj={msgObj}
          allChannels={allChannels}
          channelsDetails={channelsDetails}
          showChannelHandler={showChannelHandler}
          allChannelsHandler={allChannelsHandler}
          channelAbout={channelAbout}
          members={members}
          userMenuRef={userMenuRef}
          logoutUserHandler={logoutUserHandler}
          user={user}
          openMenuHandler={openMenuHandler}
          showCreateChannel={showCreateChannel}
        />
      </div>
      <CreateChannel
        createChannelRef={createChannelRef}
        createChannel={createChannelHandler}
        createChannelErr={createChannelErrors}
        inputValueHandler={inputValueHandler}
        textAreaValueHandler={textAreaValueHandler}
        createChannelInputRef={createChannelInputRef}
        createChannelTextAreaRef={createChannelTextAreaRef}
      />
    </>
  );
};

export default ChatPortal;

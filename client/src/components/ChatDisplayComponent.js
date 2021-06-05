import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import botImage from '../svg/bot.png';
import noPhoto from '../svg/noProfilePhoto.png';
import moment from 'moment';
import { getChatMessages } from '../redux/actions/chatMessagesAction';

const ChatDisplayComponent = ({
  channelName,
  newMessageHandler,
  sendMsgHandler,
  newMsgRef,
  channels,
  chatPanelRef,
  msgObj,
  allChannels,
  channelsDetails,
  showChannelHandler,
  allChannelsHandler,
  channelAbout,
  members,
  userMenuRef,
  logoutUserHandler,
  user,
  openMenuHandler,
  showCreateChannel,
}) => {
  const dispatch = useDispatch();

  // const [dataMsg, setDataMsg] = useState([]);

  const { chatMsgArr } = useSelector((state) => state.chatMessagesArray);

  const searchInputRef = useRef(null);
  const ulRef = useRef(null);

  const searchChannels = () => {
    //declare variables
    let filter, listItems, i, txtValue;
    filter = searchInputRef.current.value.toUpperCase();
    listItems = ulRef.current.childNodes;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < listItems.length; i++) {
      txtValue =
        listItems[i].children[1].textContent ||
        listItems[i].children[1].innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        listItems[i].style.display = '';
      } else {
        listItems[i].style.display = 'none';
      }
    }
  };

  const showChannel = () => {
    const mobileMenu = document.querySelector('.MobileMenu');
    const closeIcon = document.querySelector('.CloseIcon');
    mobileMenu.style.display = 'block';
    closeIcon.style.display = 'block';
  };

  const closeMenuHandler = () => {
    const mobileMenu = document.querySelector('.MobileMenu');
    const closeIcon = document.querySelector('.CloseIcon');
    mobileMenu.style.display = 'none';
    closeIcon.style.display = 'none';
  };

  window.addEventListener('resize', () => {
    if (window.innerWidth > 414) {
      const mobileMenu = document.querySelector('.MobileMenu');
      const closeIcon = document.querySelector('.CloseIcon');
      mobileMenu.style.display = 'none';
      closeIcon.style.display = 'none';
    }

    if (window.innerHeight <= 415) {
      document.querySelector('.ChatPanelContainer').style.height = '60%';
      document.querySelector('.UserMenu').style.width = '60%';
      document.querySelector('.UserMenu').style.bottom = '50px';
    } else {
      document.querySelector('.ChatPanelContainer').style.height = '78%';
      document.querySelector('.UserMenu').style.width = '50%';
      document.querySelector('.UserMenu').style.bottom = '40px';
    }
  });

  // console.log(window.innerWidth);

  let dbMsgs;
  if (chatMsgArr) {
    dbMsgs = chatMsgArr.map((msgs, i) => (
      <div key={i} className='ChatMonth'>
        {msgs.chatMessages
          .filter((msg) => msg.channelName.toUpperCase() === channelName)
          .map((msg, i) => (
            <p key={i} className='Month'>
              {msgs.chatDate}
            </p>
          ))}

        {msgs.chatMessages
          .filter((msg) => msg.channelName.toUpperCase() === channelName)
          .map((msg) => {
            return msg.messagesArray.map((msg, i) => (
              <div key={i} className='UserMessageContainer'>
                <div
                  className='UserPhoto'
                  style={{
                    backgroundImage:
                      msg.username === 'ChatApp Bot'
                        ? `url(${botImage})`
                        : `url(${msg.userPhoto})`,
                  }}
                ></div>

                <div className='UserMessage'>
                  <small className='UserName'>{msg.username}</small>
                  <small className='ChatTime'>
                    {moment(msg.time).isSame(moment(), 'day')
                      ? `Today at ${moment(msg.time).format('h:mm a')}`
                      : moment(msg.time).isSame(
                          moment().subtract(1, 'day'),
                          'day'
                        )
                      ? `Yesterday at ${moment(msg.time).format('h:mm a')}`
                      : null}
                  </small>
                  <p className='ChatMsg'>{msg.text}</p>
                </div>
              </div>
            ));
          })}
      </div>
    ));
  }

  useEffect(() => {
    if (chatMsgArr) {
      const panelContainer = document.querySelector('.ChatPanelContainer');

      // .props.children[1][0].length > count

      if (dbMsgs[dbMsgs.length - 1]) {
        panelContainer.scrollTop = panelContainer.scrollHeight;
      }
    }
  }, [chatMsgArr, dbMsgs]);

  useEffect(() => {
    if (channelName) {
      setTimeout(() => {
        dispatch(getChatMessages());
      }, 1000);
    }
  }, [dispatch, channelName, msgObj]);

  return (
    <>
      <div className='MobileMenu'>
        {allChannels && (
          <>
            <div className='ChannelsHeadingContainer'>
              <h3 className='ChannelsHeading'>channels</h3>
              <i
                className='material-icons AddIcon'
                title='create channel'
                onClick={showCreateChannel}
              >
                add
              </i>
            </div>

            <div className='ChannelDetailsContainer'>
              <div className='SearchInputGroup'>
                <i className='material-icons'>search</i>
                <input
                  type='text'
                  placeholder='search'
                  ref={searchInputRef}
                  onKeyUp={searchChannels}
                />
              </div>

              <div className='ChannelDetails'>
                <ul ref={ulRef}>
                  {channels.map((name, i) => (
                    <li key={i} onClick={showChannelHandler}>
                      <div className='NameAbbr'>
                        <span>
                          {
                            name.channelName
                              .split(',')[0]
                              .split(' ')[0]
                              .split('')[0]
                          }
                        </span>
                        <span>
                          {name.channelName.split(',')[0].split(' ')[1]
                            ? name.channelName
                                .split(',')[0]
                                .split(' ')[1]
                                .split('')[0]
                            : null}
                        </span>
                      </div>
                      <span className='ChannelName'>
                        {name.channelName.toUpperCase()}
                      </span>
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
              {channelAbout}
              <h4 className='ChannelNameHeading'>Members</h4>

              <div className='ChannelMembers'>
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
                            className='statusLogo'
                            style={{
                              backgroundColor: member.onlineStatus
                                ? 'green'
                                : 'tomato',
                            }}
                          ></div>
                          <div
                            className='MemberPhoto'
                            style={{
                              backgroundImage: `url(${member.profileImage})`,
                              opacity: member.onlineStatus ? '1' : '0.5',
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
          <i className='material-icons ArrowDownIcon' onClick={openMenuHandler}>
            keyboard_arrow_down
          </i>
        </div>
      </div>
      {channels
        .filter((chan) => {
          return chan.channelName.toUpperCase() === channelName;
        })
        .map((chan, i) => (
          <div key={i} className='ChatDisplayContainer'>
            <div className='ChatDisplayHeadingContainer'>
              <div className='ChatDisplayHeading'>
                <i className='material-icons MenuIcon' onClick={showChannel}>
                  menu
                </i>
                <h3 className='ChannelsHeading' style={{ marginLeft: '10px' }}>
                  {chan.channelName}
                </h3>

                <i
                  className='material-icons CloseIcon'
                  onClick={closeMenuHandler}
                >
                  clear
                </i>
              </div>
            </div>

            <div className='ChatPanelContainer' ref={chatPanelRef}>
              {/* <div className='ChatMonth'>
                <p className='Month'>{moment().format('MMM DD YYYY')}</p>

                {showMsgs}
              </div> */}
              {dbMsgs}
            </div>

            <form onSubmit={sendMsgHandler}>
              <div className='InputMessageGroup'>
                <input
                  type='text'
                  placeholder='Type a message here'
                  onChange={newMessageHandler}
                  onSubmit={sendMsgHandler}
                  ref={newMsgRef}
                />
                <button title='send' onClick={sendMsgHandler}>
                  <i className='material-icons'>send</i>
                </button>
              </div>
            </form>
          </div>
        ))}
    </>
  );
};

export default ChatDisplayComponent;

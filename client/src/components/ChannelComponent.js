import React, { useRef } from 'react';
import noPhoto from '../svg/noProfilePhoto.png';

const ChannelComponent = ({
  allChannels,
  showCreateChannel,
  ALL_CHANNELS,
  showChannelHandler,
  channelsDetails,
  allChannelsHandler,
  channelAbout,
  members,
  channelName,
  userMenuRef,
  logoutUserHandler,
  user,
  openMenuHandler,
}) => {
  // console.log(channelAbout);
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

  return (
    <>
      <div className='ChannelsContainer'>
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
                  {ALL_CHANNELS.map((name, i) => (
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
    </>
  );
};

export default ChannelComponent;

import botImage from '../svg/bot.png';
import moment from 'moment';

export const chatMsgOutput = (chatMsg) => {
  const innerDiv = (
    <div>
      <div
        className='UserPhoto'
        style={{
          backgroundImage:
            chatMsg.username === 'ChatApp Bot'
              ? `url(${botImage})`
              : `url(${chatMsg.userPhoto})`,
        }}
      ></div>
      <div className='UserMessage'>
        <small className='UserName'>{chatMsg.username}</small>
        <small className='ChatTime'>
          {moment(chatMsg.time).isSame(moment(), 'day')
            ? `Today at ${moment(chatMsg.time).format('h:mm a')}`
            : moment(chatMsg.time).isSame(moment().subtract(1, 'day'), 'day')
            ? `Yesterday at ${moment(chatMsg.time).format('h:mm a')}`
            : null}
        </small>
        <p className='ChatMsg'>{chatMsg.text}</p>
      </div>
    </div>
  );

  const div = document.createElement('div');
  div.classList.add('UserMessageContainer');
  div.innerHTML = innerDiv;
  // console.log(innerDiv);
  document.querySelector('.ChatMessages').appendChild(div);
};

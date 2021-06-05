const moment = require('moment');

const formatMessage = (username, text, userPhoto) => {
  return {
    username,
    text,
    userPhoto,
    time: moment(),
  };
};

// m = moment('2021-04-20', 'YYYY-MM-DD');

// let today = moment();
// console.log(today);

// console.log(m.fromNow());

// let day = moment().isSame(moment(), 'day');
// console.log(day);

module.exports = formatMessage;

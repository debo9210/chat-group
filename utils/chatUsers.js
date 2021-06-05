const users = [];

//join user to chat
const userJoin = (id, username, channelName, userPhoto) => {
  const user = { id, username, channelName, userPhoto };

  //   console.log(user, 'user details');

  users.push(user);
  //   console.log(users, 'inside userJoin');
  return user;
};

const getCurrentUser = (id) => {
  //   console.log(users, 'getCurrentUsers');
  return users.find((user) => user.id === id);
};

module.exports = {
  userJoin,
  getCurrentUser,
};

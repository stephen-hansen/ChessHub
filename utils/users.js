/* eslint-disable no-console */
const users = {};

function userJoin(id, username, gameId) {
  const newUser = {
    username,
    gameId,
  };

  users[id] = newUser;
  return newUser;
}

function userLeave(id) {
  delete users[id];
  console.log(`removed ${id} from memory`);
}

function getUsers() { return users; }

module.exports = {
  userJoin,
  userLeave,
  getUsers,
};

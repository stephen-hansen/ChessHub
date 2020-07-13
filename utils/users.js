let users = {};

function userJoin(id, username, gameId){
	let newUser = {
	   	username,
	   	gameId
	};
   	
   	users[id] = newUser;
   	return newUser;
}

//remove user from memory
//return the game that they were in so we can remove them from the game as well
function userLeave(id) {
   	let game = users[id].gameId;
	delete users[id];
   	console.log("removed " + id + " from memory");
	return game;
}

function getUsers() { return users }

module.exports = { 
   userJoin,
   userLeave,
   getUsers
};

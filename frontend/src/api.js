// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:8080');

function createGame() {
    let username = document.getElementById("username").value;

    //need to make a request for a new gameId
    fetch("http://localhost:8080/api/createGame", {
            method: "POST",
            mode: "cors",
        }).then((response) => {
            response.json()
                .then((json) => {

                    //redirect user to the game
                    window.location.href = "/loading?username=" + username + "&gameId=" + json.gameId;
                });
        })
        .catch(err => {
            console.log(err)
        });
}

function joinGame() {
    let username = document.getElementById("username").value;
    let gameId = document.getElementById("game-id").value;

    //need to make a request for a new gameId
    fetch("http://localhost:8080/api/joinGame", {
            method: "POST",
            body: JSON.stringify({
                gameId: gameId
            }),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => {
            if (response.ok) {
                //redirect user to the game
                window.location.href = "/g?username=" + username + "&gameId=" + gameId;
            } else {
                console.log("game is either full or does not exist");
            }

        })
        .catch(err => {
            console.log(err)
        });
}

function declareLeave(username, gameId) {
  console.log("Leaving game...", username, gameId);
  fetch("http://localhost:8080/api/declareLeave", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                gameId: gameId
            }),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => {
            if (response.ok) {
                //redirect user to the game
                // window.location.href = "/";
            } else {
                console.log("unknown error");
            }

        })
        .catch(err => {
            console.log(err)
        });
}


export {
    joinGame
};
export {
    createGame
};
export {
  declareLeave
};
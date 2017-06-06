
var socket = io();
var user = {
    username: "",
    id: ""
};

var match = {
    color : 0,
    opponentId : 0
};
var board;

$("#lobby").hide();
$("#chessgame").hide();

var formHandler = function() {
    user.username = $("#name").val();
    user.id = socket.io.engine.id;
    $("#main").hide();
    $("#lobby").show();
    socket.emit('login', user);
};

$("#submit").on('click', formHandler);


var game;

socket.on('move', function(move) {
    game.move(move);
    board.position(game.fen(), false);
});

function gameInit(color, opponentId) {
    match.color = color;
    match.opponentId = opponentId;
    board = ChessBoard("chessgame", {
    draggable: true,
    position: "start" ,
    sparePieces: true,
    onDrop : drop
    });
    game = new Chess();
}

socket.on('gameStart' , function(opponentId) {
    gameInit(1, opponentId);
    $("#lobby").hide();
    $("#chessgame").show();
});
	  
socket.on('LobbyChange', function(inLobby) {
    document.getElementById('lobby').innerHTML = "";
    $.each(inLobby, function(key, value) {
	if (user.id === key) {
	    return true;
	}
	$("#lobby").append($('<button>').text(value.username)
			   .on('click', function() {
			   gameInit(0, key);
			   $("#lobby").hide();
			   $("#chessgame").show();
			   socket.emit("invite" , key);
			  }));
    });
});

var drop = function(source, target, piece, newPos, oldPos, orientation) {
    var move = {
	from: source,
	to: target
    };
    if (game.move(move) !== null) {
	move.opponent = match.opponentId;
	socket.emit('move', move);
    }
    else {
	return 'snapback';
    }
    board.position(game.fen(), false);
    
    //console.log(source);
}


console.log("Hello World");

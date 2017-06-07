
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
var turn;
$("#lobby").hide();
$("#game").hide();

var formHandler = function() {
    user.username = $("#name").val();
    user.id = socket.io.engine.id;
    $("#main").hide();
    $("#lobby").show();
    socket.emit('login', user);
};

$("#submit").on('click', formHandler);

$("#message").on('keydown' , function(e) {
    if (e.keyCode === 13) {
	var message = {
	    m : $("#message").val(),
	    sender : user.username,
	    dest : match.opponentId
	};
	messageUpdate(message, 'user');
	socket.emit('message' , message);
	$("#message").val('');
    }
});
var game;

socket.on('move', function(move) {
    game.move(move);
    board.position(game.fen(), false);
    turn = (turn + 1) & 1;
});

function gameInit(color, opponentId) {
    match.color = color;
    orient = "black";
    if (color === 0) {
	orient = "white";
    }
    match.opponentId = opponentId;
    board = ChessBoard("chessgame", {
	draggable: true,
	position: "start" ,
	orientation: orient,
	onDrop : drop,
	onDragStart : dragStart,
	onSnapEnd : snapEnd
    });
    game = new Chess();
    turn = 0;
}

socket.on('leftMatch', function(id) {
    if (id === match.opponentId) {
	alert("Opponent Left the Match");
    }
});

socket.on('gameStart' , function(opponentId) {
    gameInit(1, opponentId);
    $("#lobby").hide();
    $("#game").show();
});
	  
socket.on('LobbyChange', function(inLobby) {
    document.getElementById('buttons').innerHTML = "";
    $.each(inLobby, function(key, value) {
	if (user.id === key) {
	    return true;
	}
	$("#buttons").append($('<button>').text(value.username)
			   .on('click', function() {
			   gameInit(0, key);
			   $("#lobby").hide();
			   $("#game").show();
			   socket.emit("invite" , key);
			  }));
    });
});

function messageUpdate(message, id) {
    var string = message.sender + ": " + message.m;
    $("#chatbox").append($('<p>').text(string).addClass(id));
};
socket.on('message' , function(message) {
    messageUpdate(message, "op");
});

var drop = function(source, target, piece, newPos, oldPos, orientation) {
    var move = {
	from: source,
	to: target,
	promotion: 'q'
    };
    if (game.move(move) !== null) {
	move.opponent = match.opponentId;
	socket.emit('move', move);
    }
    else {
	return 'snapback';
    }
    board.position(game.fen(), false);
    turn = (turn + 1) & 1;
};

var dragStart = function(source, piece, pos, orientation) {
    var value = 0;
    if (piece.charAt(0) === 'b') {
	value = 1;
    }
    return (turn === match.color &&  value === match.color);
};

var snapEnd = function(source, target, piece) {
    board.position(game.fen(), false);
};



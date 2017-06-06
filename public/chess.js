
var socket = io();
var users = [];
var user = {
    username: "",
    id: socket.id ,
    opponentID: ""
};

$("#lobby").hide();
$("#chessgame").hide();

var formHandler = function() {
    user.username = $("#name").val();
    $("#main").hide();
    $("#chessgame").show();
    socket.emit('login', user);
};

$("#submit").on('click', formHandler);


var game = new Chess();

socket.on('move', function(move) {
    var move = JSON.parse(move);
    game.move(move);
    board.position(game.fen(), false);
});

socket.on('LobbyChange', function(inLobby) {
    for (var x = 0; x<inLobby.length; x++) {
	console.log(inLobby[x].username);
    }
});

var drop = function(source, target, piece, newPos, oldPos, orientation) {
    var move = {
	from: source,
	to: target
    };
    if (game.move(move) !== null) {
	console.log("Move is good\n");
	socket.emit('move', JSON.stringify(move));
    }
    else {
	return 'snapback';
    }
    board.position(game.fen(), false);
    
    //console.log(source);
}

var board = ChessBoard("chessgame", {
    draggable: true,
    position: "start" ,
    sparePieces: true,
    onDrop : drop
});

console.log("Hello World");

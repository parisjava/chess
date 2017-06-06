
var socket = io();
var users = {};
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
    $("#lobby").show();
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
    document.getElementById('lobby').innerHTML = "";
    $.each(inLobby, function(value, key) {
	console.log(key.username);
	$("#lobby").append($('<button>').text(key.username)
			   .on('click', function() {
			       //socket.emit("createGame" , user.id);
			   }));
    });
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

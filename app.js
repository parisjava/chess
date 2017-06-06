var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var inLobby = {};

app.use(express.static('public'));
app.get('/' , function(req, res) {
    res.sendFile(__dirname + '/public/game.html');
});



io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('move', function(move) {
	socket.broadcast.to(move.opponent).emit('move', move);
    });


    socket.on('login', function(user) {
	inLobby[user.username] = user;
	io.emit('LobbyChange', inLobby);
    });

    socket.on('invite', function(opponent) {
	delete inLobby[socket.id];
	io.emit('LobbyChange', inLobby);
	delete inLobby[opponent];
        socket.broadcast.to(opponent).emit('gameStart');
    });
    
});
console.log(port);
http.listen(port, function() {
    console.log('listening on *:' + port);
});

var express = require("express")
	, http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

// routing
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function(socket) {

	// when the client emits 'sendchat'
	socket.on('sendchat', function(data) {
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'adduser'
	socket.on('adduser', function(username) {
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat', 'SERVER', 'You have connected');
		io.sockets.emit('updateusers', usernames);
	});

	// when a user disconnects
	socket.on('disconnect', function() {
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
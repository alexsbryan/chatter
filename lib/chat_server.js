var server = require('../server.js').server;
//returns server variable
var io = require('socket.io').listen(server)
  , fs = require('fs')

var guestNumber = 1;
var nicknames = {};
var currentRooms = {};
//Socket.io is required in chat_server.js
//HTTP is required in server.js

//This will be in your chat_server.js file
var that = this;
io.sockets.on('connection', function (socket) {

  joinRoom(socket, "lobby");

  nicknames[socket.id] = "guest_" + guestNumber;
  socket.emit('guestNumber', {guestNum: guestNumber,
  roomName: currentRooms[socket.id],
  socketId: socket.id});

  guestNumber += 1;

  socket.on('message', function (data) {

    io.sockets.in(currentRooms[socket.id]).emit(
      'pushedMessage', {text: data.text, name: nicknames[data.num]})

  });

  socket.on("changeName", function (data) {
    var old = nicknames[data.num]
    nicknames[data.num] = data.text;
    //todo make exclusive to room
    io.sockets.emit('pushedMessage', {text: old + " changed their nickname to: "  + data.text, name: 'alert'})
  });

  socket.on("changeRoom", function(data){
    joinRoom(socket, data.room);

    var users = io.sockets.clients(data.room);
    console.log(users);
    var returnedUsers = [];
    for(var i = 0; i< users.length; i++){

      returnedUsers.push( nicknames[ users[i].id ] );

    }
    socket.emit("pushedMessage", {text: "You're now in " + data.room, name: "alert"});

    io.sockets.in(data.room).emit("updateNames", {users: returnedUsers});
  });

});

var joinRoom = function(socket, room){
  socket.leave(currentRooms[socket.id]);
  socket.join(room);
  currentRooms[socket.id] = room;
}
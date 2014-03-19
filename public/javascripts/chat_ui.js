$(function(){
  var chat = new window.ChatApp.Chat(io.connect());

  $("#chat-form").on("submit", function(event){
    event.preventDefault();
    var inputField = $(event.currentTarget).find("#message-body")
    var message = inputField.val();

    if(message.substring(0,1) == '/'){
      chat.processCommand(message.substring(1));
    }else{
      chat.sendMessage(message);
    }
    inputField.val('');
  })

  chat.socket.on("pushedMessage", function(data){
    $("#messages").append("<li class='list-group-item'>" + data.name + ": " + data.text + " </li>");

  })

  chat.socket.on("updateNames", function(data){
    $("#roommates").empty();

    for(var i = 0; i < data.users.length; i++){
    $("#roommates").append("<li class='list-group-item'>" + data.users[i] + "</li>")
    }
  })

  chat.socket.on("guestNumber", function(data){
    chat.guestNumber = data.guestNum;
    chat.socketId = data.socketId;
    chat.currentRoom = data.roomName;
  })

});
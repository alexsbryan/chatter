(function(root){
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var Chat = ChatApp.Chat = function(socket){
    this.socket = socket
  }

  Chat.prototype.sendMessage = function(message){
    this.socket.emit("message", {text: message, num: this.socketId} );
  }

  Chat.prototype.changeName = function(name){
    this.socket.emit("changeName", {text: this.name, num: this.socketId})
  }

  Chat.prototype.changeRoom = function(room){
    this.socket.emit("changeRoom", {room: room})
  }

  Chat.prototype.processCommand = function(message){


    if(message.substring(0,4) == 'nick'){
      var tempName = message.substring(5);
      this.name = tempName
      this.changeName(tempName)
    }else if(message.substring(0,4) == 'join'){

      this.currentRoom = message.substring(5);
      this.changeRoom(this.currentRoom);
    }else{
      console.log("Asshole.")
    }

  }

})(this);
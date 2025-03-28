services folder = connecting server to third party software like db etc 

# Socket.io
connected client -> means connecting a socket
on -> for recieving the message 
emit -> for sending the message 

// Receiving a message from the client
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
  }

// Sending the message back to all clients
    io.emit('receiveMessage', message);
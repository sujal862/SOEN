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





















    {
    "text": "This is the file tree structure for an Express server using ES6 modules.  Make sure you have Node.js version 14 or higher installed to use ES modules with Express.",
    "fileTree": {
        "app.js": {
            "content": "import express from 'express';\n\nconst app = express();\nconst port = process.env.PORT || 3000;\n\n// Middleware to parse JSON bodies\napp.use(express.json());\n\n// Simple GET endpoint\napp.get('/', (req, res) => {\n  res.send('Hello from ES6 Express!');\n});\n\n// Error handling middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something went wrong!');\n});\n\napp.listen(port, () => {\n  console.log(`Server is listening on port ${port}`);\n});\n"
        },
        "package.json": {
            "content": "{\n  \"name\": \"es6-express-server\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Express server with ES6 modules\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"node app.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.2\"\n  }\n}\n"
        }
    }
}
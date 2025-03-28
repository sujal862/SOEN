import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'
import projectModel from './models/project.model.js'

const port = process.env.port || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


io.use( async (socket, next) => { //middleware for socket io to autenticate the user before forming connection

    try{ //socket.handshake object is used for retrieving metadata about the client during the WebSocket handshake.

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId; //projectid will be room id

        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid project id'));
        }

        socket.project = await projectModel.findById(projectId); //just saving data inside variable

        if(!token) {
            return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return next(new Error('Authentication error'));
        }

        socket.user = decoded;

        next();

    } catch (error) {
        next(error); //if next is called with error than socket io will not form connection
    }
})

io.on('connection', socket => { // whenever a new connection(new user connects) is formed with server than this function(callback) will run
    socket.roomId = socket.project._id.toString();

    console.log('a user connected');

    socket.join(socket.roomId); // joining the room with project id

    socket.on('project-message', data => { // Adds a socket(client) to a room and broadcast the message(coming from client) to all sockets in a specific room.
        socket.broadcast.to(socket.roomId).emit('project-message', data); //on broadcasting the message to all the sockets in the room, except the sender will not receive the message.
    })

    socket.on('disconnect', () => { 
        console.log('User disconnected:', socket.user);
     });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
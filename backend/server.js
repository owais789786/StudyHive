const { Server } = require('socket.io');
const { createServer } = require('http');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const Message = require('./src/models/message.model');
const socketEventHandler = require('./src/sockets/eventHandler.socket');

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);
    
    socketEventHandler(io, socket);

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

connectDB.then(() => {
    httpServer.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })

}).catch(error => {
    console.log("Failed to start server :" + error);
})




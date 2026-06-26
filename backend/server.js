const { Server } = require('socket.io');
const { createServer } = require('http');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const Message = require('./src/models/message.model');

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    socket.on('send_solo_message', async (data) => {
        try {
            const newMessage = Message.create({
                sender: data.sender,
                receiver: data.receiver,
                content: data.content,
                messageType: data.messageType
            })
        } catch (error) {

        }
    })

})

connectDB.then(() => {
    httpServer.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })

}).catch(error => {
    console.log("Failed to start server :" + error);
})




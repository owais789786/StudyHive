const app = require('./src/app');
const connectDB = require('./src/config/db');
const { Server } = require('socket.io');
const { createServer } = require('http')

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on('connection',(socket)=>{
    console.log('user connected:' ,socket.id);
    
})

connectDB.then(() => {
    httpServer.listen(process.env.PORT, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })

}).catch(error => {
    console.log("Failed to start server :" + error);
})

httpServer.listen(process.env.PORT, () => {
    console.log("server is running at port :" + process.env.PORT)
})


const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running at port : ${process.env.PORT}`);
    })
}).catch(error => {
    console.log("Failed to start server :" + error);
})




const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Use the appropriate route files
const login = require('./routes/login');
const register = require('./routes/register');
const userslist = require('./routes/userslist');
const announcements = require('./routes/announcement');
const routesname = require('./routes/routesName');
const truckName = require('./routes/registerTruck');
const loginTruck = require('./routes/loginTruck');
const flag = require('./routes/LocationFlag');
const history = require('./routes/recordHistory');
const kiloRecording = require('./routes/kiloRecording');
const fuelRecording = require('./routes/fuelRecords');
const resetPass = require('./routes/resetPass');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://22104720:tipdasandlanohan1@cluster0.jtxxll7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}
connect();

// Session setup
app.use(
    session({
        secret: 'h8dfvd8vdv7dvndjnvdvvy7d6v7d6vd76vdv', // Replace with a secure key
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1-day expiration
    })
);

// Route handlers
app.use('/API/login', login);
app.use('/API/register', register);
app.use('/API/users', userslist);
app.use('/API/Announcements', announcements);
app.use('/API/Route', routesname);
app.use('/API/RegisterTruck', truckName);
app.use('/API/loginTruck', loginTruck);
app.use('/API/flag', flag);
app.use('/API/history', history);
app.use('/API/kiloRecording', kiloRecording);
app.use('/API/fuelRecording', fuelRecording);
app.use('/API/resetPass', resetPass);

// Test route
app.get('/', (req, res) => {
    res.send('Hello Node App');
});

// Start server
app.listen(8000, () => {
    console.log("Server started on port 8000");
});

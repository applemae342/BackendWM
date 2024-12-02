const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
// require('dotenv').config();

// Add this line to your existing code
app.use(cors());


app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('Hello Node App');
});
const residents_statusRoutes=require('./routes/residens_status')
const login=require('./routes/login')
const register=require('./routes/register')
const userslist=require('./routes/userslist')
const announcements=require('./routes/announcement')
const routesname=require('./routes/routesName')
const truckName=require('./routes/registerTruck')
const loginTruck=require('./routes/loginTruck')
const flag=require('./routes/LocationFlag')
const history=require('./routes/recordHistory')
const otpRoutes = require('./routes/otp')
const verifyOtp = require('./routes/otp')


app.use('/API/Status', residents_statusRoutes);
app.use('/API/login',login)
app.use('/API/register',register)
app.use('/API/users',userslist)
app.use('/API/Announcements',announcements)
app.use('/API/Route',routesname)
app.use('/API/RegisterTruck',truckName)
app.use('/API/loginTruck',loginTruck)
app.use('/API/flag',flag)
app.use('/API/history',history)
app.use('/API/otp', otpRoutes)
app.use('/API/otp', verifyOtp)


app.listen(8000, () => {
    console.log("Server started on port 8000");
});
//localhost listener is 8000


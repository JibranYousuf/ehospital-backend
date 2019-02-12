const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
// const MongoClient = require('mongodb').MongoClient
//Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
useMongoClient: true

//On Connection
mongoose.connection.on('connected', ()=> {
    console.log('connected to database '+ config.database)
});

//On Error
mongoose.connection.on('error', (err)=> {
    console.log('Database error '+err)
});

const app = express();

const users = require('./routes/users');
const appointments = require('./routes/appointments');
const prescriptions = require('./routes/prescriptions');
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/appointments', appointments);
app.use('/prescriptions', prescriptions);
// Index Route
app.get('/', (req,res) =>{
res.send('invalid endpoint')
});

// Start Server
app.listen(port, () =>{
console.log('server started on port '+port)
});
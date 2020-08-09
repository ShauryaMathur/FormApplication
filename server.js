const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketServer = require('socket.io');
const {
    addForm,
    getDepartmentPendingForms,
    getRequestedFormsSocket,
    approveForm,
    rejectForm,
    getApprovedFormsSocket,
getRejectedFormsSocket,
getAllUsers,getAllDepartments
} = require('./routes/api/forms');



const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
});


// BodyParser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to Mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('MonogDb Connected...!')).catch(err => console.log(err));

// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const server = http.createServer(app);
const io = socketServer.listen(server);


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') { // Set a static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

server.listen(port)

const connections = [];
try {
    io.on("connection", (socket) => {
        console.log('Connected :' + socket.id)
        socket.on('addForm', function (data) {
            addForm(data);
            socket.emit('formAdded', data);
            io.emit('formAdded',data)
        })
        socket.on('getDepartmentPendingForms', function (data) {
            getDepartmentPendingForms(socket, data);
        })

        socket.on('getRequestedFormsSocket', function (data) {
            getRequestedFormsSocket(socket, data);

        })

        socket.on('approveForm', function (id) {
            approveForm(io,socket, id);
        })

        socket.on('rejectForm', function (id) {
            rejectForm(io,socket, id);
        })

        socket.on('getApprovedFormsSocket', function (data) {
            getApprovedFormsSocket(socket, data)

        })

        socket.on('getRejectedFormsSocket', function (data) {
            getRejectedFormsSocket(socket, data)

        })

        socket.on('getAllUsers',function(data){
            getAllUsers(socket)
        })

        socket.on('getAllDepartmentsSocket',function(data){
            getAllDepartments(socket)
        })



        connections.push(socket);
    })

} catch (err) {
    console.log(err);
}

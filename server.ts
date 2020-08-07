import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import ioserver, { Socket } from 'socket.io';

const app = express();

// My server. THis allows me to create a server to use with socket.io 
const server = require('http').Server(app)

// This will create a server for me based off of my express server and passes it to socket.io 
// so that socket.io knows what server I am useing
const io = ioserver(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
    
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket=> {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
   
})


server.listen(3000)
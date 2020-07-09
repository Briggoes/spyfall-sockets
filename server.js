const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const fs = require('fs')

const { Rooms } = require('./room')
const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    pingInterval: 10000,
    pingTimeout: 5000
})

var rooms = new Rooms()

io.on('connection', (socket) => {
    socket.on('joinMatch', (matchId, username) => {
        console.log(`'joinMatch' by client: ${socket.id} with arg ${matchId}`)
        socket.username = username

        if (!rooms.has(matchId)) return socket.emit('invalidMatch')
        var match = rooms.get(matchId)
        if (match.has(socket.id)) return socket.emit('alreadyInMatch')

        match.addClient(socket)
        socket.join(match.id)

        console.log(`Client ${socket.id} joined match with id '${match.id}'`)
        socket.in(match.id).emit('playerJoined', username)
        socket.emit('joinedMatch', Array.from(match.clients.values()).map(i => i = i.username))
    })

    socket.on('createMatch', (username) => {
        console.log(`'createMatch' by client: ${socket.id}`)
        socket.username = username

        var match = rooms.createRoom()
        match.addClient(socket)
        rooms.addRoom(match)
        socket.join(match.id)

        console.log(`Client ${socket.id} created match with id '${match.id}'`)
        socket.emit('matchCreated', match.id)
        socket.emit('playerJoined', username)
    })

    console.log(`New connection from client: ${socket.id}`)
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/spyfall.html')))
app.use(express.static('public'))

// Get all the packs in the server
// This is basically here cause in the long run I want to let users add their own
app.get('/packs', (req, res) => {
    var files = fs.readdirSync('./spyfall_packs')
    var packs = {}

    files.forEach(pack => {
        var json = require(`./spyfall_packs/${pack}`)
        packs[pack.replace('.json', '')] = json
    })

    res.send(packs)
})

server.listen(PORT, console.log(`Listening on ${PORT}`))
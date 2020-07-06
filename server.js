const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const { Rooms } = require('./room')
const fs = require('fs')
const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    pingInterval: 10000,
    pingTimeout: 5000
})

var rooms = new Rooms()

io.on('connection', (socket) => {
    socket.on('joinMatch', (matchId) => {
        console.log(`'joinMatch' by client: ${socket.id} with arg ${matchId}`)

        if (!rooms.has(matchId)) return socket.emit('invalidMatch')

        var match = rooms.get(matchId)
        match.addClient(socket)
        socket.join(match.id)

        console.log(`Client ${socket.id} joined match with id '${match.id}'`)
        socket.in(match.id).send(`Client ${socket.id} joined`)
    })

    socket.on('createMatch', () => {
        console.log(`'createMatch' by client: ${socket.id}`)

        var match = rooms.createRoom()
        match.addClient(socket)
        rooms.addRoom(match)
        socket.join(match.id)

        console.log(`Client ${socket.id} created match with id '${match.id}'`)
        socket.emit('matchCreated', match.id)
    })

    console.log(`New connection from client: ${socket.id}`)
})

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
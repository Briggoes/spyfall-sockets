var socket = io()
// https://stackoverflow.com/a/57192874
var params = new URLSearchParams(document.location.search)

var main = document.getElementById('main')
var lobby = document.getElementById('lobby')

var name_field = document.getElementById('name_field')
var room_field = document.getElementById('room_field')
var player_list = document.getElementById('player_list')

socket.on('connect', () => {
    console.log('Connected')

    socket.on('event', data => console.log(data))
    socket.on('message', (data) => console.log(data))
    socket.on('disconnect', () => console.log('Disconnected'))

    socket.on('invalidMatch', () => alert('Esta sala no existe!'))
    socket.on('alreadyInMatch', () => alert('Ya estas en esta sala!'))

    socket.on('matchCreated', (roomId) => {
        main.hidden = true
        lobby.hidden = false
        console.log(`${name_field.value} created room ${roomId}`)
    })

    socket.on('joinedMatch', (usernames) => {
        main.hidden = true
        lobby.hidden = false
        usernames.forEach(username => {
            player_list.innerHTML += `<li>${username}</li>`
            console.log(`${username} joined the room`)
        })
    })

    socket.on('playerJoined', (username) => {
        player_list.innerHTML += `<li>${username}</li>`
        console.log(`${username} joined the room`)
    })

    var roomId = params.get('match')
    if (roomId) {
        room_field.value = roomId
        alert('Fuiste invitado a una partida! Elige tu nombre y oprime Unirse a sala!')
    }

    var joinMatchBtn = document.getElementById('joinMatchBtn')
    joinMatchBtn.onclick = () => {
        if (name_field.value == '') return alert('Nombre de usuario invalido!')
        socket.emit('joinMatch', room_field.value, name_field.value)
    }

    var createMatchBtn = document.getElementById('createMatchBtn')
    createMatchBtn.onclick = () => {
        if (name_field.value == '') return alert('Nombre de usuario invalido!')
        socket.emit('createMatch', name_field.value)
    }
})
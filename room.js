class Rooms {
    constructor() {
        this.rooms = new Map()
    }
    // I couldn't find the actual answer but it was found in StackOverflow :D
    _generateId() {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }
    _idExists(id) {
        return this.rooms.has(id)
    }
    createRoom() {
        var id = this._generateId()
        while (this._idExists(id)) {
            id = this._generateId()
        }

        var room = new Room(id)
        return room
    }
    addRoom(room) {
        if (!(room instanceof Room)) return
        this.rooms.set(room.id, room)
    }
    get(id) {
        return this.rooms.get(id)
    }
    has(id) {
        return this.rooms.has(id)
    }
}

class Room {
    constructor(id) {
        this.clients = new Map()
        this.id = id
    }
    addClient(client) {
        this.clients.set(client.id, client)
    }
    get(id) {
        return this.clients.get(id)
    }
    has(id) {
        return this.clients.has(id)
    }
}

module.exports = { Rooms, Room }


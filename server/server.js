const SocketIO = require('socket.io')

const parser = require('socket.io-json-parser')
const io = SocketIO(3000, {
      path: '/davinci/socket.io',
      serveClient: false,
      parser
});

io.on('connection', (socket) => {
    console.log('here comes a client...')

    socket.on('graph', (data, callback) => {
        console.log(data)
        callback('{aaa:111}')
    })
})


const fs = require('fs')
const path = require('path')
const SocketIO = require('socket.io')
const parser = require('socket.io-json-parser')

async function getGraph()
{
    const filePath = path.join(__dirname, 'genesis-node-n-links2.json')
    return fs.promises.readFile(filePath, {encoding: 'utf-8', flag: 'r'})
                .then(d => JSON.parse(d))
}

const io = SocketIO(3000, {
      path: '/davinci/socket.io',
      serveClient: false,
//      parser
});

io.on('connection', (socket) => {
    console.log('here comes a client...')

    socket.on('graph', (params, callback) => {
        console.log('Received graph request from client with params: %o', params)
        getGraph().then(graph => {
            callback(graph)
            console.log('Return graph response as: %o', graph)
        })
        .catch(err => {
            console.log(err)
        })
    })
})


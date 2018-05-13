///////////////////////////////////////
/// defines actions here 
/////////////////////////////////////////
// import * as d3 from "d3"
import SocketIO from 'socket.io-client'

export const UPDATE_GRAPH = 'update_graph'
export const FORWARD_GRAPH = 'forward_graph'
export const REWIND_GRAPH = 'rewind_graph'

const parser = require('socket.io-json-parser') 
// const parser = require('socket.io-msgpack-parser') 
const socket = SocketIO(window.location.hostname, {
    transports: ['websocket'],
    path: `${window.location.pathname}socket.io`,
    reconnection: true,
    reconnectionAttempts: 3,
    // parser
}) 

export const retrieveDataFromSvr = (night_watcher) => (dispatch) => {
    /*d3.json('./genesis-node-n-links2.json').then(function(raw_data) {
        dispatch(updateGraph(raw_data))
        night_watcher()
    })*/
    socket.emit('graph', {day: '2018-05-12'}, (graph) => {
        console.log("%s %o", typeof graph, graph)
        dispatch(updateGraph(graph))
        night_watcher()
    })
}

export const updateGraph = (graph) => {
    return {
        type: UPDATE_GRAPH,
        graph
    }
}

export const forwardGraph = () => {
    return {
        type: FORWARD_GRAPH
    }
}

export const rewindGraph = () => {
    return {
        type: REWIND_GRAPH
    }
}

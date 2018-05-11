///////////////////////////////////////
/// defines actions here 
/////////////////////////////////////////
import * as d3 from "d3"

export const UPDATE_GRAPH = 'update_graph'
export const FORWARD_GRAPH = 'forward_graph'
export const REWIND_GRAPH = 'rewind_graph'

export const retrieveDataFromSvr = (night_watcher) => (dispatch) => {
    d3.json('./genesis-node-n-links2.json').then(function(raw_data) {
        dispatch(updateGraph(raw_data))
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

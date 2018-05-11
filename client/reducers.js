import * as d3 from 'd3'
import * as _ from 'lodash'
import { combineReducers } from 'redux'
import { UPDATE_GRAPH, FORWARD_GRAPH, REWIND_GRAPH } from './actions'
import { cook } from './cook'

const graphReducer = (state = {}, action) => {
    switch (action.type)
    {
        case UPDATE_GRAPH:
            state = cook(action.graph)
            console.log('graph data updation completed...')
            return state

        case FORWARD_GRAPH:
            return forwardGraph(state, action)

        case REWIND_GRAPH:
            return rewindGraph(state, action)

        default:
            return state
    }
}

const forwardGraph = (state = {}, action) => {
    if (_.isEqual(state.current_date, state.end_date))
    {
        return state
    }
            
    let graph = Object.assign({}, state)
    let next_date = d3.timeDay.offset(graph.current_date, 1)
    graph.current_date = next_date
    graph.current_day = graph.formatter(next_date)

    return graph
}

const rewindGraph = (state = {}, action) => {
    if (_.isEqual(state.current_date, state.start_date))
    {
        return state
    }

    let graph = Object.assign({}, state)
    let prev_date = d3.timeDay.offset(graph.current_date, -1)
    graph.current_date = prev_date
    graph.current_day = graph.formatter(prev_date)

    return graph
}

const rootReducer = combineReducers({ 
    graph: graphReducer
})

export default rootReducer;

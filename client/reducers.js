import { combineReducers } from 'redux'
import { RETRIEVE_DATA_FROM_SVR, 
    UPDATE_GRAPH} from './actions'

const retrieveDateReducer = (state, action) => {
    if (action.type != RETRIEVE_DATA_FROM_SVR)
        throw Error('type is expected to be UPDATE_GRAPH')

    return {}
}

const graphReducer = (state, action) => {
    if (action.type != UPDATE_GRAPH)
        throw Error('type is expected to be UPDATE_GRAPH')

    return {}
}

const rootReducer = combineReducers({ 
    retrieveDateReducer,
    graphReducer
})

export default rootReducer;

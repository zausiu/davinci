///////////////////////////////////////
/// defines actions here 
/////////////////////////////////////////

export const RETRIEVE_DATA_FROM_SVR = 1
export const UPDATE_GRAPH = 2

export const retrieveDataFromSvr = () => {
    return {
        type: RETRIEVE_DATA_FROM_SVR
    }
}

export const updateGraph = (graph) => {
    return {
        type: UPDATE_GRAPH,
        graph
    }
}

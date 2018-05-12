import * as d3 from 'd3'
import { draw_nodes, create_directed_graph } from './penman'
import store from './store'
import { retrieveDataFromSvr, forwardGraph, rewindGraph } from './actions'
import { filter_graph } from './cook'
import './directed-graph.css'
import 'bootstrap/dist/css/bootstrap.min.css'

var svg = d3.select('#directed_graph')
set_button_handlers(svg)
store.dispatch(retrieveDataFromSvr(() => create_directed_graph(svg)))

function set_button_handlers(svg)
{
    let prev_btn = d3.select("#prev_day");
    prev_btn.on("click", () => {
        store.dispatch(rewindGraph())
        create_directed_graph(svg);
    });

    let next_btn = d3.select("#next_day");
    next_btn.on("click", () => {
        store.dispatch(forwardGraph())
        create_directed_graph(svg);
    });
}

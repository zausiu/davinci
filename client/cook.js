import * as d3 from "d3";
    
export function cook(graph) {
    graph.start_date = d3.isoParse(graph.start_day)
    graph.current_date = graph.start_date
    graph.current_day = graph.start_day
    graph.end_date = d3.isoParse(graph.end_day)
    graph.days_count = d3.timeDay.count(graph.start_date, graph.end_date)
    if (graph.days_count <= 0)
    {
        throw new Error(`start_day:${graph.start_day} is not expected to surpass end_day:${graph.end_day}!`)
    }

    graph.date_range = d3.timeDay.range(graph.start_date, graph.end_date)
    graph.caption = `Trails from ${graph.start_day} to ${graph.end_day}`
    graph.formatter = d3.timeFormat("%Y-%m-%d")

    return graph
}

export function filter_graph(graph) {
    let unique_ids = new Set();
    let filtered_nodes = []
    let all_nodes = graph.nodes
    for (let i = 0; i < all_nodes.length; i++)
    {
        let node = all_nodes[i]
        let date = d3.isoParse(node['day'])
        if (date < graph.start_date || date > graph.current_date)
            continue

        filtered_nodes.push(node)
        unique_ids.add(node.id)
    }

    let filtered_links = []
    let all_links = graph.links
    // console.log("unique_ids: %o", unique_ids);
    // console.log("all_links: %o", all_links);
    for (let i = 0; i < all_links.length; i++)
    {
        let link = all_links[i]
        let source = link.source
        let target = link.target
        if ((unique_ids.has(source) && unique_ids.has(target)) 
            || (unique_ids.has(source.id) && unique_ids.has(target.id)))
        {
            filtered_links.push(link)
        }
    }

    let filtered_graph = Object.assign({}, {nodes: filtered_nodes, links: filtered_links})

    return filtered_graph
}

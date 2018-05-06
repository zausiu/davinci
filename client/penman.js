import * as d3 from "d3";

export function draw_nodes(g, nodes)
{
    let color = d3.scaleOrdinal(d3.schemeAccent);
    let node = g.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { 
            if ('color' in d)
                return d.color;
            else
                return color(d.group); 
        });

    return node;
}

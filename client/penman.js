import * as d3 from "d3";
import * as _ from "lodash";

export function draw_nodes(g, nodes, ctrl)
{
    // console.log(`nodes are: ${nodes}`)

    let color = d3.scaleOrdinal(d3.schemeAccent);

    const sz = 250;
    let circle = d3.symbol().type(d3.symbolCircle).size(sz);
    let diamond = d3.symbol().type(d3.symbolDiamond).size(sz);
    let square = d3.symbol().type(d3.symbolSquare).size(sz);
    let star = d3.symbol().type(d3.symbolStar).size(sz);
    let triangle = d3.symbol().type(d3.symbolTriangle).size(sz);

    let generator_map = {
        circle: circle,
        diamond: diamond,
        square: square,
        star: star,
        triangle: triangle
    };

    let node = g.append("g").attr("class", "node")
            .selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("d", d => generator_map[d.type]())
            .attr("fill", d => {
                let date = d3.isoParse(d.day);
                let current_date = ctrl.get_current_day();
                console.log("%o %o", d.day, current_date[1]);
                if (_.isEqual(date, current_date[0]))
                {
                    return color(d.group);
                }
                else
                {
                    return d3.color("black");
                }
            });

    return node;
}

import * as d3 from "d3"
import * as _ from "lodash"
import store from './store'
import { filter_graph } from './cook'
import './directed-graph.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export function create_directed_graph(svg) 
{
    // console.log("store state: %o", store.getState())
    let graph = filter_graph(store.getState().graph)
    d3.select('#caption').text(graph.caption);

    let parentWidth = svg.node().parentNode.clientWidth;
    let parentHeight = svg.node().parentNode.clientHeight;
	
    svg.attr('width', parentWidth).attr('height', parentHeight)

    // remove any previous graphs
    let r = svg.selectAll('.g-main line').remove();
    r = svg.selectAll('.g-main path').remove();
    r = svg.selectAll('.g-main g').remove();
    r = svg.selectAll('.g-main rect').remove();
    r = svg.selectAll('.g-main .link').remove();
    r = svg.selectAll('.g-main').remove();

    var gMain = svg.append('g').classed('g-main', true);

    var rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', 'white')

    var gDraw = gMain.append('g');

    var zoom = d3.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);

    function zoomed() {
        // When a zoom event listener is invoked, d3.event is set to the current zoom event. 
        gDraw.attr('transform', d3.event.transform);
    }

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
    }

    var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    // console.log("link: %o", graph.links);

    var node = draw_nodes(gDraw, graph.nodes).on("mouseover", (d) => {
            // d3.select('#blurb').text(`id: ${d.id}`);
            let text = JSON.stringify(d)
            text = text.replace(/(?:\r\n|\r|\n|,)/g, '<br/>');
            text = text.replace(/(?:")/g, '');
            text = text.substring(1, text.length - 2);
            d3.select('#blurb').html(text);
        })
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      
    // add titles for mouseover blurbs
    node.append("title")
        .text(function(d) { 
            if ('name' in d)
                return d.name;
            else
                return d.id; 
        });

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
                .id(function(d) {
                    // return 1;
                    // console.log(d);
                    return d.id; 
                })
                .distance(function(d) { 
                    return 70;
                    var dist = 20 / d.value;
                    console.log('dist:', dist);

                    return dist; 
                })
              )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
        //.force("x", d3.forceX(parentWidth/2))
        //.force("y", d3.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
        }

        d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed |= 2; 
          d.fx = d.x;
          d.fy = d.y;
        })

    }

    function dragged(d) {
      //d.fx = d3.event.x;
      //d.fy = d3.event.y;
            node.filter(function(d) { return d.selected; })
            .each(function(d) { 
                d.fx += d3.event.dx;
                d.fy += d3.event.dy;
            })
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
        })
    }

    var current_day = graph.current_day
    // console.log(current_day);
    var texts = [current_day,
                 ''];
    svg.selectAll('text').remove();
    svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', '5.4em')
        .attr('y', '1em')
        .attr('font-size', '55')
        .text(function(d) { return d; });

    return graph;
}

export function draw_nodes(g, nodes)
{
    // console.log(`nodes are: ${nodes}`)

    let color = d3.scaleOrdinal(d3.schemeAccent)

    const sz = 250
    let circle = d3.symbol().type(d3.symbolCircle).size(sz)
    let diamond = d3.symbol().type(d3.symbolDiamond).size(sz)
    let square = d3.symbol().type(d3.symbolSquare).size(sz)
    let star = d3.symbol().type(d3.symbolStar).size(sz)
    let triangle = d3.symbol().type(d3.symbolTriangle).size(sz)

    let generator_map = {
        circle: circle,
        diamond: diamond,
        square: square,
        star: star,
        triangle: triangle
    }

    let current_date = store.getState().graph.current_date
    let node = g.append("g").attr("class", "node")
            .selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("d", d => generator_map[d.type]())
            .attr("fill", d => {
                let date = d3.isoParse(d.day)
                if (_.isEqual(date, current_date))
                {
                    return color(d.group);
                }
                else
                {
                    return d3.color("black");
                }
            })

    return node
}

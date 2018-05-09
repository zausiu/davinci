import * as d3 from "d3";
import * as _ from "lodash";

export class Controller
{
    constructor(json_raw_data)
    {
        this.raw_data = json_raw_data;
        this.start_date = d3.isoParse(json_raw_data.start_day);
        this.current_date = this.start_date;
        this.end_date = d3.isoParse(json_raw_data.end_day);
        this.days_count = d3.timeDay.count(this.start_date, this.end_date);
        if (this.days_count <= 0)
        {   
            throw new Error("start_day is not expected to surpass end_day!");
        }
        this.day_range = d3.timeDay.range(this.start_date, this.end_date);
        this.caption = `Trails from ${json_raw_data.start_day} to ${json_raw_data.end_day}`;

        this.formatter = d3.timeFormat("%Y-%m-%d")
    }

    get_caption()
    {
        return this.caption;
    }

    get_current_day()
    {
        return [this.current_date, this.formatter(this.current_date)];
    }

    get_next_day()
    {
        if (_.isEqual(this.current_date, this.end_date))
            return null;

        let next_day = d3.timeDay.offset(this.current_date, 1);

        return [next_day, this.formatter(next_day)];
    }

    goto_next_day()
    {
        let n = this.get_next_day();
        if (n === null)
            return null;

        this.current_date = n[0];
        return n;
    }

    get_prev_day()
    {
        if (_.isEqual(this.current_date, this.start_date))
            return null;

        let prev_day = d3.timeDay.offset(this.current_date, -1);

        return [prev_day, this.formatter(prev_day)];
    }

    goto_prev_day()
    {
        let p = this.get_prev_day();
        if (p === null)
            return null;

        this.current_date = p[0];
        return p;
    }

    get_graph()
    {
        let unique_ids = new Set();
        let filtered_nodes = [];
        let all_nodes = this.raw_data.nodes;
        for (let i = 0; i < all_nodes.length; i++)
        {
            let node = all_nodes[i];
            let date = d3.isoParse(node['day']);
            if (date < this.start_date || date > this.current_date)
                continue;

            filtered_nodes.push(node);
            unique_ids.add(node.id);
        }

        let filtered_links = [];
        let all_links = this.raw_data.links;
        // console.log("unique_ids: %o", unique_ids);
        // console.log("all_links: %o", all_links);
        for (let i = 0; i < all_links.length; i++)
        {
            let link = all_links[i];
            let source = link.source;
            let target = link.target;
            if ((unique_ids.has(source) && unique_ids.has(target)) 
                || (unique_ids.has(source.id) && unique_ids.has(target.id)))
            {
                filtered_links.push(link);
            }
        }

        let graph = { nodes: filtered_nodes, links: filtered_links };

        return graph;
    }
}

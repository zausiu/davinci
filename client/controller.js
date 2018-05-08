import * as d3 from "d3";

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
        if (this.current_date == this.end_date)
            return null;

        next_day = d3.timeDay.offset(this.current_date, 1);

        return [next_day, this.formatter(next_day)];
    }

    get_prev_day()
    {
        if (this.current_date == this.start_date)
            return null;

        prev_day = d3.timeDay.offset(this.current_date, -1);

        return [prev_day, this.formatter(prev_day)];
    }
}

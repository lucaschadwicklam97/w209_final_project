

var parseDate = d3.timeParse("%Y-%m-%d");

var width = 1000
var height = 500

var margin = ({top: 0, right: 30, bottom: 0, left: 30}),
      iwidth = width - margin.left - margin.right,
      iheight = height - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var rowConverter = function(d) {
    return {
        date: parseDate(d.date), price: parseFloat(d.price)
    };
} 

var ticker = "TSLA";
var ticker = "SUPN";

d3.csv(ticker + ".csv", rowConverter, function(data) {
	
	var dataset = data;

	var xScale = d3.scaleTime()
		.domain([
			d3.min(dataset, function(d) { return d.date }), 
			d3.max(dataset, function(d) { return d.date })
		])
		.range([width - iwidth, iwidth]);

	var yScale = d3.scaleLinear()
		.domain([
			d3.min(dataset, function(d) { return d.price }),
		d3.max(dataset, function(d) { return d.price })
		])
		.range([iheight, 0]);
	
	var line = d3.line()
		.x(function(d) { return xScale(d.date); })
		.y(function(d) { return yScale(d.price); })
                .curve(d3.curveMonotoneX); 

	var svg = d3.select("body")
		.append("svg")
		.attr("width", iwidth)
		.attr("height", iheight)
	        .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0, 500)")
		.call(d3.axisBottom(xScale)
			.tickFormat(d3.timeFormat("%Y-%m-%d")))
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-65)");

	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale));



	svg.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line)
	        .attr("stroke", "steelblue")
	        .attr("fill", "none")
                .attr("stroke-width", "6");
});



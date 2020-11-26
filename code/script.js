

var parseDate = d3.timeParse("%Y-%m-%d");

var width = 1000,
	height = 500,
	//reveal x axis
	xAxisSpace = 70,
	xLabelSpace = 10,
	//reveal y axis
	yAxisSpace = 70,
	yLabelSpace = 10,
	//add label names
	xlabel = "Date",
    ylabel = "Price",
    //add button sizes
    buttonh = 10, 
    buttonw = 10,
    //reveal buttons
    buttonSpace = 100
;

var margin = ({top: 0, right: 0, bottom: 0, left: 0}),
      iwidth = width - margin.left - margin.right,
      iheight = height - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var rowConverter = function(d) {
    return {
        date: parseDate(d.date), price: parseFloat(d.price)
    };
} 

var ticker = "./data/TSLA";
var ticker = "./data/SUPN";

//get list of available tickers
//d3.csv(tickersector.csv, rowConverter, function(data) {
	
//	var tickers = data;

//});


d3.csv(ticker + ".csv", rowConverter, function(data) {
	
	var dataset = data;

    // set X and Y axis scale
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
		.attr("width", iwidth + yAxisSpace + yLabelSpace + buttonSpace) 
		// yAxisSpace, yLabelSpace and buttonSpace reveals each
		.attr("height", iheight + xAxisSpace + xLabelSpace) 
		//xAxisSpace and xLabelSpace reveal x axis and label
	        .append("g")
	        .attr("transform", "translate(" + yAxisSpace + "," + margin.top + ")");

	svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0, 500)")
		.call(d3.axisBottom(xScale)
			.tickFormat(d3.timeFormat("%Y-%m-%d")))
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-65)")
	;

	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale))
	;

	svg.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line)
	    .attr("stroke", "steelblue")
	    .attr("fill", "none")
        .attr("stroke-width", "6")
    ;

    svg.append("text")             
  		.classed("chartAxis", true)
  		.attr("y", height + xAxisSpace + 5)
      	.attr("x", width / 2)
        .text(xlabel)
        .attr("id","xlabel")
    ;

    svg.append("text")
       	.classed("chartAxis", true)
      	.attr("transform", "rotate(-90)")
      	.attr("y", -60)
      	.attr("x", -height / 2)
      	.text(ylabel)
        .attr("id","ylabel")
    ;

    // make a button for each stock
    tickNum = 0 // will have this driven by a function later to catch each ticker
    svg.append("rect")
        .attr('fill', "rgb(200,200,200)")
        .attr("y", tickNum*15)
        .attr("x", width+10)
        .attr("width", buttonw)
        .attr("height", buttonh)
        .on('mouseover', tickerButtonmOver)
        .on('mouseout', tickerButtonmOut)
        .on('click', function(){
          cpInlayClick('tickerButtonClick')
          ;
        })

    function tickerButtonmOver (d, i) {
        d3.select(this)
          .transition()
          .duration('50')
          .attr('opacity', '.5')
        ;
    };

    function tickerButtonmOut (d, i) {
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1');
    };

    // function for click
    function tickerButtonClick () {
        //code
        ;
    
    };     
});



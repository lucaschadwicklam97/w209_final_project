

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

var parseDate = d3.timeParse("%m/%d/%y");
var formDate = d3.timeFormat("%m/%d/%y");

var tickers = ['AMZN', 'FB', 'GOOGL', 'HZNP', 'MRNA', 'NFLX', 'NKTR', 'SUPN', 'TSLA', 'ZGNX']

var count = d3.set(tickers).size();

var rowConverter = function(d) {
    return {
        date: parseDate(d.date), 
        AMZN: parseFloat(d[tickers[0]]),
        FB: parseFloat(d[tickers[1]]),
        GOOGL: parseFloat(d[tickers[2]]),
        HZNP: parseFloat(d[tickers[3]]),
        MRNA: parseFloat(d[tickers[4]]),
        NFLX: parseFloat(d[tickers[5]]),
        NKTR: parseFloat(d[tickers[6]]),
        SUPN: parseFloat(d[tickers[7]]),
        TSLA: parseFloat(d[tickers[8]]),
        ZGNX: parseFloat(d[tickers[9]]),
        AMZNdate: parseDate(d[tickers[0]+"date"]),
        FBdate: parseDate(d[tickers[1]+"date"]),
        GOOGLdate: parseDate(d[tickers[2]+"date"]),
        HZNPdate: parseDate(d[tickers[3]+"date"]),
        MRNAdate: parseDate(d[tickers[4]+"date"]),
        NFLXdate: parseDate(d[tickers[5]+"date"]),
        NKTRdate: parseDate(d[tickers[6]+"date"]),
        SUPNdate: parseDate(d[tickers[7]+"date"]),
        TSLAdate: parseDate(d[tickers[8]+"date"]),
        ZGNXdate: parseDate(d[tickers[9]+"date"]),
        AMZNprice: parseFloat(d.AMZNprice),
        FBprice: parseFloat(d.FBprice),
        GOOGLprice: parseFloat(d.GOOGLprice),
        HZNPprice: parseFloat(d.HZNPprice),
        MRNAprice: parseFloat(d.MRNAprice),
        NFLXprice: parseFloat(d.NFLXprice),
        NKTRprice: parseFloat(d.NKTRprice),
        SUPNprice: parseFloat(d.SUPNprice),
        TSLAprice: parseFloat(d.TSLAprice),
        ZGNXprice: parseFloat(d.ZGNXprice),    
    };
} 

d3.csv("./data/stockdata.csv", rowConverter, function(data) {

	var dataset = data,
		//set starting ticker
		price = "AMZN",
		newsdate = price+"date"
		newsprice = price+"price"
	;

	//extract news
	news = dataset.map(
		function(d){
			if (!isNaN(d[price])){
				return {
					"date": d[newsdate],
					"price": d[newsprice]
				}
			}
		}
	);

	//filter with Fereshteh
	news = news.filter(function (d) {
    return !isNaN(d.price);
	});
	console.log(news)

    // set X and Y axis scale
	var xScale = d3.scaleTime()
		.domain([
			d3.min(dataset, function(d) { return d.date }), 
			d3.max(dataset, function(d) { return d.date })
		])
		.range([width - iwidth, iwidth]);

	var yScale = d3.scaleLinear()
		.domain([
			d3.min(dataset, function(d) { return d[price] }),
			d3.max(dataset, function(d) { return d[price] })
		])
		.range([iheight, 0]);

	var line = d3.line()
		.x(function(d) { return xScale(d.date); })
		.y(function(d) { return yScale(d[price]); })
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
		.attr("class", "clickDelete")

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
        .attr("stroke-width", "1")
        .attr("class", "clickDelete")
    ;

    //add circles for news
    svg.selectAll("circle")
    	.data(news)
    	.enter()
    	.append("circle")
    	.attr("r", 5)
    	.attr("cx", function(d,i){
    		return xScale(d.date);
    	})
    	.attr("cy", function(d,i){
    		return yScale(d.price);
    	})
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
    for(var i = 0; i < count; ++i) {

	    svg.append("rect")
	        .attr('fill', "rgb(200,200,200)")
	        .attr("y", i*15)
	        .attr("x", width+10)
	        .attr("width", buttonw)
	        .attr("height", buttonh)
	        //.attr("id", function(d, i) { return 'name'+i; })
	        .on('mouseover', tickerButtonmOver)
	        .on('mouseout', tickerButtonmOut)
	        .on('click', function(){
	        	// get the index of the button by dividing y by 15 d3.select(this).attr("y")/15 
	        	tickerButtonClick(d3.select(this).attr("y")/15)
	        	;
	        })
	    ;

	    svg.append("text")
            .attr("y", i*15 +10)
            .attr("x", width + buttonw + 20)
            .text(tickers[i])
        ;
    }

    // add functions for mouseover and mouseout
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
          .attr('opacity', '1')
        ;
    };
    // add function for click
    function tickerButtonClick () {
        price = tickers[arguments[0]];
        t = price;

		var yScale = d3.scaleLinear()
			.domain([
				d3.min(dataset, function(d) { return d[price] }),
				d3.max(dataset, function(d) { return d[price] })
			])
			.range([iheight, 0])
		;

		// this allows d3.min in xScale to get the lowest date for each ticker
		var filteredDates = dataset.filter(function(d){
			return d[price]>0
		});

		var xScale = d3.scaleTime()
			.domain([
				d3.min(filteredDates, function(d) { return d.date }),
				d3.max(dataset, function(d) { return d.date })
			])
			.range([width - iwidth, iwidth]);

		var line = d3.line()
			.x(function(d) { return xScale(d.date); })
			.y(function(d) { return yScale(d[price]); })
	                .curve(d3.curveMonotoneX)
	    ; 
        
        d3.selectAll(".clickDelete").remove();
		
		svg.append("path")
			.datum(dataset)
			.attr("class", "line")
			.attr("d", line)
		    .attr("stroke", "steelblue")
		    .attr("fill", "none")
	        .attr("stroke-width", "1")
	        .attr("class", "clickDelete")
	    ;

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
			.attr("class", "clickDelete")
		;
    };

	//add icons for news items
	const annotations = [
    
    //{ dataset[price + "date"].forEach(function(d)
    	news.forEach( function(d,i) {
    		return'subject: {text: ">",y: "bottom",x: "right"}, data: { x: ' + news[i].date + ', y: '+ news[i].price +'}'
    		;
		})
    ]

    const type = d3.annotationCustomType(
      d3.annotationBadge, 
      {"subject":{"radius": 10 }}
    )

    const makeAnnotations = d3.annotation()
      .type(type)
      //.accessors({ 
      //  x: function(d){ return x(new Date(d.x))},
      //  y: function(d){ return y(d.y) }
      //})
      .annotations(annotations)

    d3.select("svg")
      .append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations)

});



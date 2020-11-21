// Shorthand for $( document ).ready()
$(function() {

      var rowConverter = function(d) {
        return {
          Author: d.Author,
          FictionNon: d.FictionNon,
          Subject: d.Subject,
          PaperHardback: d.PaperHardback,
          Pages: parseInt(d.Pages)
          };
        }

      d3.csv("data/books.csv", rowConverter, function(data) {
        data = data.sort(function(a,b){
          return d3.ascending(a.Pages, b.Pages)
        })
        //console.log(data);

        //authors = data.map(function(d, i){
        //	return d.Author + i.toString()
        //})
        //console.log(authors);

        // need to stop bars with same name from piling
        function add(arr) {
        	arr.push(d.Author + i.toString())
        }
        
        data.forEach(function (d, i){
        	d.Author = d.Author + i.toString()
        })
        //console.log(data);

        // margins and box for the chart
        var margin = {
            top: 70,
            right: 25,
            bottom: 15,
            left: 75
        };

        var width = 960 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;
        
        // get the svg and box it
        var svg = d3.select("#graphic").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.Pages;
            	})])
            .range([0, width])
            ;

        var y = d3.scaleBand()
            .domain(data.map(function (d) {
                return d.Author;
            }))
			.range([height, 0])
			.padding(.1)
            ;

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickSize(0).tickFormat(d => d.slice(0,-2)))


        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .style('fill', 'CornflowerBlue')
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.Author);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.Pages);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.Author) + y.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.Pages) + 3;
            })
            .text(function (d) {
                return d.Pages;
            });

        svg.append("text")             
      		//.attr("transform", 
      		//	"translate(" + (width/2) + " ," + 
            //    (height + margin.top + 20) + ")")
      		//.attr(font-size, "20px")
      		.style('fill', 'darkOrange')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
      		.attr("y", -5)
      		.attr("x", width / 2)
      		.style("text-anchor", "middle")
      		.text("Number of Pages");

      	svg.append("text")
      		.style('fill', 'darkOrange')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
      		.attr("transform", "rotate(-90)")
      		.attr("y", -60)
      		.attr("x", -height / 2)
      		//.attr(font-size, "20px")
      		.style("text-anchor", "middle")
      		.text("Author"); 

        svg.append("text")
          .style('fill', 'black')
          .style('font-size', '18px')
          .style('font-weight', 'bold')
          .attr("y", -50)
          .attr("x", width / 2)
          .style("text-anchor", "middle")
          .text("The range of book length in my office is from 64 pages to 1810 pages."); 

        svg.append("text")
          .style('fill', 'black')
          .style('font-size', '18px')
          .style('font-weight', 'bold')
          .attr("y", -25)
          .attr("x", width / 2)
          .style("text-anchor", "middle")
          .text("Authors are included below in order of book length."); 
      });
});


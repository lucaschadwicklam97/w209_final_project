// Shorthand for $( document ).ready()
$(function() {

      // attend to data types
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

        // need to stop bars with same name from piling
        function add(arr) {
        	arr.push(d.Author + i.toString())
        }
        
        data.forEach(function (d, i){
        	d.Author = d.Author + i.toString()
        })
        
        // get average for each group; this is not th`e best way to do it.
        const fictfilt = data.filter(function(d){ return d.FictionNon == "Fiction" })
        const fictavg = Math.round(fictfilt.reduce((total, next) => total + next.Pages, 0) / fictfilt.length);

        const nonfictfilt = data.filter(function(d){ return d.FictionNon == "Non Fiction" })
        const nonfictavg = Math.round(nonfictfilt.reduce((total, next) => total + next.Pages, 0) / nonfictfilt.length);

        const bizfilt = data.filter(function(d){ return d.Subject == "Business" })
        const bizavg = Math.round(bizfilt.reduce((total, next) => total + next.Pages, 0) / bizfilt.length);

        const cpufilt = data.filter(function(d){ return d.Subject == "Computers" })
        const cpuavg = Math.round(cpufilt.reduce((total, next) => total + next.Pages, 0) / cpufilt.length);

        const subficfilt = data.filter(function(d){ return d.Subject == "Fiction" })
        const subficavg = Math.round(subficfilt.reduce((total, next) => total + next.Pages, 0) / subficfilt.length);

        const histsocfilt = data.filter(function(d){ return d.Subject == "History Sociology" })
        const histsocavg = Math.round(histsocfilt.reduce((total, next) => total + next.Pages, 0) / histsocfilt.length);

        const scinatfilt = data.filter(function(d){ return d.Subject == "Science Nature" })
        const scinatavg = Math.round(scinatfilt.reduce((total, next) => total + next.Pages, 0) / scinatfilt.length);

        const selffilt = data.filter(function(d){ return d.Subject == "Self-Help" })
        const selfavg = Math.round(selffilt.reduce((total, next) => total + next.Pages, 0) / selffilt.length);

        const travelfilt = data.filter(function(d){ return d.Subject == "Travel" })
        const travelavg = Math.round(travelfilt.reduce((total, next) => total + next.Pages, 0) / travelfilt.length);

        const cookfilt = data.filter(function(d){ return d.Subject == "Cooking" })
        const cookavg = Math.round(cookfilt.reduce((total, next) => total + next.Pages, 0) / cookfilt.length);

        const paperfilt = data.filter(function(d){ return d.PaperHardback == "Paperback" })
        const paperavg = Math.round(paperfilt.reduce((total, next) => total + next.Pages, 0) / paperfilt.length);

        const hardfilt = data.filter(function(d){ return d.PaperHardback == "Hardback" })
        const hardavg = Math.round(hardfilt.reduce((total, next) => total + next.Pages, 0) / hardfilt.length);

        // margins and box for the chart, starting values for labels
        var margin = {
            top: 70,
            right: 25,
            bottom: 15,
            left: 75
        };

        var width = 960 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom,
            xlabel = "Number of Pages",
            ylabel = "Author";

        // get the svg and box it
        var svg = d3.select("#graphic").append("svg")
            .attr("class", "svgDelete")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            // make it a group so you can attach axis labels, a title, the contol panel inlay (cpInlay)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // make an x scale
        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.Pages;
            	})])
            .range([0, width])
            ;

        // make an x scale for the colors too just for fun
        var xc = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.Pages;
              })])
            .rangeRound([0, 255])
            ;

        // make a y scale
        var y = d3.scaleBand()
            .domain(data.map(function (d) {
                return d.Author;
            }))
            .range([height, 0])
            .padding(.1)
            ;

        // append y axis as a group
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickSize(0).tickFormat(d => d.slice(0,-2)))
            .attr("class", "inlaydelete")

        // create bar placeholders
        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            // append bars as a group
            .append("g")
            // set mouseover behavior for the bars
            .on('mouseover', barmOver)
            .on('mouseout', barmOut)

        //append rects
        bars.append("rect")
            .attr('fill', function(d) {
              return "rgb(0,0," + (255 - xc(d.Pages)) + ")";
            })
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.Author);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.Pages);
            })
            .attr("class", "inlaydelete")

        ;

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
            })
            .attr("class", "inlaydelete")
        ;

        var xlabel = svg.append("text")             
      		.classed("chartAxis", true)
      		.attr("y", -5)
      		.attr("x", width / 2)
          .text("Number of Pages")
          .attr("id","xlabel")
        ;

      	var ylabel = svg.append("text")
          .classed("chartAxis", true)
      		.attr("transform", "rotate(-90)")
      		.attr("y", -60)
      		.attr("x", -height / 2)
      		.text(ylabel)
          .attr("id","ylabel")
        ; 

        svg.append("text")
          .classed("chartTitle", true)
          .attr("y", -50)
          .attr("x", width / 2)
          .text("The range of book length in my office is from 64 pages to 1810 pages."); 

        svg.append("text")
          .classed("chartTitle", true)
          .attr("y", -25)
          .attr("x", width / 2)
          .text("Authors are included below in order of book length."); 

        // button dimensions for control panel inlay (cpInlay)
        var buttonh = 20, buttonw = 20;

        // make a mouseover/button for fiction, subject, back
        var fiction = svg.append("rect")
            .attr('fill', "rgb(200,200,200)")
            .attr("y", 100)
            .attr("x", width*.95)
            .attr("width", buttonw)
            .attr("height", buttonh)
            .on('mouseover', cpInlaymOver)
            .on('mouseout', cpInlaymOut)
            .on('click', function(){
              cpInlayClick('FictionNon')
              ;
            })
        ;

        var fictext = svg.append("text")
            .classed("cpInlayText", true)
            .attr("y", 100+buttonh/2)
            .attr("x", width*.95-5)
            .text("Fiction or Non-fiction")
        ;

        var subject = svg.append("rect")
            .attr('fill', "rgb(200,200,200)")
            .attr("y", 140)
            .attr("x", width*.95)
            .attr("width", buttonw)
            .attr("height", buttonh)
            .on('mouseover', cpInlaymOver)
            .on('mouseout', cpInlaymOut)
            .on('click', function(){
              cpInlayClick('Subject')
              ;
            })
        ;

        var subjtext = svg.append("text")
            .classed("cpInlayText", true)
            .attr("y", 140+buttonh/2)
            .attr("x", width*.95-5)
            .text("Subject")
        ;

        var back = svg.append("rect")
            .attr('fill', "rgb(200,200,200)")
            .attr("y", 180)
            .attr("x", width*.95)
            .attr("width", buttonw)
            .attr("height", buttonh)
            .on('mouseover', cpInlaymOver)
            .on('mouseout', cpInlaymOut)
            .on('click', function(){
              cpInlayClick('PaperHardback')
              ;
            })
        ;

        var backtext = svg.append("text")
            .classed("cpInlayText", true)
            .attr("y", 180+buttonh/2)
            .attr("x", width*.95-5)
            .text("Hardback or Paperback")
        ;       

        // functions for the hover
        function barmOver (d, i) {
            d3.select(this)
              .transition()
              .duration('50')
              .attr('opacity', '.5')
            ;

            d3.select(this)
              .append("text")
              .style('fill-opacity', 1)
              .text(function (d) {
                return 'Subject: ' + d.Subject;
              })
              .attr("y", function (d) {
                return y(d.Author) + y.bandwidth() / 2 -16;
              })
              //x position is 3 pixels to the right of the bar
              .attr("x", function (d) {
                return x(d.Pages) + 50;
              })
              .attr("class", "mOverDelete")
            ;

            d3.select(this)
              .append("text")
              .style('fill-opacity', 1)
              .text(function (d) {
                return 'Cover: ' + d.PaperHardback;
              })
              .attr("y", function (d) {
                return y(d.Author) + y.bandwidth() / 2 + 4;
              })
              //x position is 3 pixels to the right of the bar
              .attr("x", function (d) {
                return x(d.Pages) + 50;
              })
              .attr("class", "mOverDelete")
            ;

            d3.select(this)
              .append("text")
              .style('fill-opacity', 1)
              .text(function (d) {
                return 'Genre: ' + d.FictionNon;
              })
              .attr("y", function (d) {
                return y(d.Author) + y.bandwidth() / 2 + 24;
              })
              //x position is 3 pixels to the right of the bar
              .attr("x", function (d) {
                return x(d.Pages) + 50;
              })
              .attr("class", "mOverDelete")
            ;
        };

        function barmOut (d, i) {
            d3.select(this).transition()
              .duration('50')
              .attr('opacity', '1');

            d3.selectAll(".mOverDelete").remove();
            };

        function cpInlaymOver (d, i) {
            d3.select(this)
              .transition()
              .duration('50')
              .attr('opacity', '.5')
            ;
        };

        function cpInlaymOut (d, i) {
            d3.select(this).transition()
              .duration('50')
              .attr('opacity', '1');
        };

        // function for click
        function cpInlayClick () {
            //d3.selectAll(".inlaydelete").remove();
            //xlabel.getElementById('xlabel').text("Average Number of Pages");
            
            d3.selectAll(".svgDelete").remove();

            var ylabel = arguments[0];

            if (ylabel == "FictionNon") {
              ds = [{BarLabel: "Fiction", Pages: fictavg}, {BarLabel: "NonFiction", Pages: nonfictavg}],
              clickLabel = 'Genre'
              ds = ds.sort(function(a,b){
                return d3.ascending(a.Pages, b.Pages)
              })
            }

            else if (ylabel == "Subject") {
              ds = [{BarLabel: "Business", Pages: bizavg}, {BarLabel: "Computers", Pages: cpuavg}, {BarLabel: "Fiction", Pages: subficavg}, {BarLabel: "History/Sociology", Pages: histsocavg}, {BarLabel: "Science/Nature", Pages: scinatavg}, {BarLabel: "Self-Help", Pages: selfavg}, {BarLabel: "Travel", Pages: travelavg}, {BarLabel: "Cooking", Pages: cookavg}],
              clickLabel = 'Subject'
              ds = ds.sort(function(a,b){
                return d3.ascending(a.Pages, b.Pages)
              })
            } 

            else if (ylabel == "PaperHardback") {
              ds = [{BarLabel: "Paperback", Pages: paperavg}, {BarLabel: "Hardback", Pages: hardavg}],
              clickLabel = 'Cover'
              ds = ds.sort(function(a,b){
                return d3.ascending(a.Pages, b.Pages)
              })
            }

            // margins and box for the chart, starting values for labels
            var margin = {
                top: 70,
                right: 25,
                bottom: 15,
                left: 75
            };

            var width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                xlabel = "Number of Pages",
                ylabel = arguments[0];

            // get the svg and box it
            var svg = d3.select("#graphic").append("svg")
                .attr("class", "svgDelete")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                // make it a group so you can attach axis labels, a title, the contol panel inlay (cpInlay)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // make an x scale
            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d.Pages;
                  })])
                .range([0, width])
                ;

            // make an x scale for the colors too just for fun
            var xc = d3.scaleLinear()
                .domain([0, d3.max(ds, function (d) {
                    return d.Pages;
                  })])
                .rangeRound([0, 255])
                ;

            // make a y scale
            var y = d3.scaleBand()
                .domain(ds.map(function (d) {
                    return d.BarLabel;
                }))
                .range([height, 0])
                .padding(.1)
                ;

            // append y axis as a group
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y).tickSize(0))
                .attr("class", "inlaydelete")

            // create bar placeholders
            var bars = svg.selectAll(".bar")
                .data(ds)
                .enter()
                // append bars as a group
                .append("g")
                // set mouseover behavior for the bars
                //.on('mouseover', barmOver)
                //.on('mouseout', barmOut)

            //append rects
            bars.append("rect")
                .attr('fill', function(d) {
                  return "rgb(0,0," + (255 - xc(d.Pages)) + ")";
                })
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.BarLabel);
                })
                .attr("height", y.bandwidth())
                .attr("x", 0)
                .attr("width", function (d) {
                    return x(d.Pages);
                })
                .attr("class", "inlaydelete")
            ;

            //add a value label to the right of each bar
            bars.append("text")
                .attr("class", "label")
                //y position of the label is halfway down the bar
                .attr("y", function (d) {
                    return y(d.BarLabel) + y.bandwidth() / 2 + 4;
                })
                //x position is 3 pixels to the right of the bar
                .attr("x", function (d) {
                    return x(d.Pages) + 3;
                })
                .text(function (d) {
                    return d.Pages;
                })
                .attr("class", "inlaydelete")
            ;

            var xlabel = svg.append("text")             
              .classed("chartAxis", true)
              .attr("y", -5)
              .attr("x", width / 2)
              .text("Number of Pages")
              .attr("id","xlabel")
            ;

            var ylabel = svg.append("text")
              .classed("chartAxis", true)
              .attr("transform", "rotate(-90)")
              .attr("y", -60)
              .attr("x", -height / 2)
              .text(clickLabel)
              .attr("id","ylabel")
            ; 

            svg.append("text")
              .classed("chartTitle", true)
              .attr("y", -50)
              .attr("x", width / 2)
              .text(function (){return "The data can be divided by " + clickLabel}); 

            svg.append("text")
              .classed("chartTitle", true)
              .attr("y", -25)
              .attr("x", width / 2)
              .text("Average book length is presented."); 

            // button dimensions for control panel inlay (cpInlay)
            var buttonh = 20, buttonw = 20;

            // make a mouseover/button for fiction, subject, back
            var fiction = svg.append("rect")
                .attr('fill', "rgb(200,200,200)")
                .attr("y", 100)
                .attr("x", width*.95)
                .attr("width", buttonw)
                .attr("height", buttonh)
                .on('mouseover', cpInlaymOver)
                .on('mouseout', cpInlaymOut)
                .on('click', function(){
                  cpInlayClick('FictionNon')
                  ;
                })
            ;

            var fictext = svg.append("text")
                .classed("cpInlayText", true)
                .attr("y", 100+buttonh/2)
                .attr("x", width*.95-5)
                .text("Fiction or Non-fiction")
            ;

            var subject = svg.append("rect")
                .attr('fill', "rgb(200,200,200)")
                .attr("y", 140)
                .attr("x", width*.95)
                .attr("width", buttonw)
                .attr("height", buttonh)
                .on('mouseover', cpInlaymOver)
                .on('mouseout', cpInlaymOut)
                .on('click', function(){
                  cpInlayClick('Subject')
                  ;
                })
            ;

            var subjtext = svg.append("text")
                .classed("cpInlayText", true)
                .attr("y", 140+buttonh/2)
                .attr("x", width*.95-5)
                .text("Subject")
            ;

            var back = svg.append("rect")
                .attr('fill', "rgb(200,200,200)")
                .attr("y", 180)
                .attr("x", width*.95)
                .attr("width", buttonw)
                .attr("height", buttonh)
                .on('mouseover', cpInlaymOver)
                .on('mouseout', cpInlaymOut)
                .on('click', function(){
                  cpInlayClick('PaperHardback')
                  ;
                })
            ;

            var backtext = svg.append("text")
                .classed("cpInlayText", true)
                .attr("y", 180+buttonh/2)
                .attr("x", width*.95-5)
                .text("Hardback or Paperback")
            ;

            var allbooks = svg.append("rect")
                .attr('fill', "rgb(255, 140, 0)")
                .attr("y", 220)
                .attr("x", width*.95)
                .attr("width", buttonw)
                .attr("height", buttonh)
                .on('mouseover', cpInlaymOver)
                .on('mouseout', cpInlaymOut)
                .on('click', function(){
                  location.reload()
                  ;
                })
            ;

            var allbookstext = svg.append("text")
                .classed("cpInlayText", true)
                .attr("y", 220+buttonh/2)
                .attr("x", width*.95-5)
                .text("Go back and show all books")
            ;        

        }; 

      });
});


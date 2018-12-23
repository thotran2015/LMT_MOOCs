//zoom in when click
		function zoom(currentNode){
			let node = svg.selectAll('.node')
			updatePieTitle(currentNode);
			updatePieGraph(currentNode);
			updateBarChart1(currentNode);
			d3.event.stopPropagation();

			let currentTarget = d3.event.currentTarget; // the <g> el

			if (currentNode === focusedNode) {
				// no focusedNode or same focused node is clicked
				return;
			}
			let lastNode = focusedNode;
			focusedNode = currentNode;

			simulation.alphaTarget(0.2).restart();
			// hide all circle-overlay
			d3.selectAll('.circle-overlay').classed('hidden', true);
			d3.selectAll('.node-icon').classed('node-icon--faded', false);

			// don't fix last node to center anymore
			if (lastNode) {
				lastNode.fx = null;
				lastNode.fy = null;
				node.filter((d, i) => i === lastNode.index)
					.transition().duration(2000).ease(d3.easePolyOut)
					.tween('circleOut', () => {
						let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
						return (t) => {
							lastNode.r = irl(t);
						}
					})
					.on('interrupt', () => {
						lastNode.r = lastNode.radius;
					});
			}

			// if (!d3.event.active) simulation.alphaTarget(0.5).restart();

			d3.transition().duration(2000).ease(d3.easePolyOut)
				.tween('moveIn', () => {
					console.log('tweenMoveIn', currentNode);
					let ix = d3.interpolateNumber(currentNode.x, centerX);
					let iy = d3.interpolateNumber(currentNode.y, centerY);
					let ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
					return function (t) {
						// console.log('i', ix(t), iy(t));
						currentNode.fx = ix(t);
						currentNode.fy = iy(t);
						currentNode.r = ir(t);
						simulation.force('collide', forceCollide);
					};
				})
				.on('end', () => {
					simulation.alphaTarget(0);
					let $currentGroup = d3.select(currentTarget);
					$currentGroup.select('.circle-overlay')
						.classed('hidden', false);
					$currentGroup.select('.node-icon')
						.classed('node-icon--faded', true);

				})
				.on('interrupt', () => {
					console.log('move interrupt', currentNode);
					currentNode.fx = null;
					currentNode.fy = null;
					simulation.alphaTarget(0);
				});
		}
function updatePieTitle(currentNode){
	var pieSvg = d3.select("#pieChart svg");
	pieSvg.selectAll("text.title") // target the text element(s) which has a title class defined
		.attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .text(currentNode.name+" Thread Forums")
	    .attr("class","title")
	}

function updatePieGraph(currentNode){
	var updatedData = datasetPieChosen(currentNode.icon)
	var basics = dsPieChartBasics(pieColorScheme);
	//remove pie body
	d3.select("#pieChart").select("#pieChartPlot").select("#pieCenter").remove()
	var pieBody= d3.select("#pieChart").select("#pieChartPlot")
		.append("svg:g")                //make a group to hold our pie chart
	    .attr("id", "pieCenter")
	    .data([updatedData])                   //associate our data with the document
	    .attr("transform", "translate(" + basics.outerRadius + "," + basics.outerRadius + ")");
	   var arc = d3.arc()              //this will create <path> elements for us using arc data
        	.outerRadius(basics.outerRadius).innerRadius(basics.innerRadius);

   var pie = d3.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array
   var arcs = pieBody.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice")    //allow us to style things in the slices (like text)
        .on("mouseover", mouseover)
    	.on("mouseout", mouseout)
    	.on("click", up);
    				
        arcs.append("svg:path")
               .attr("fill", function(d, i) { return basics.color(i); } ) //set the color for each slice to be chosen from the color function defined above
               .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
					.append("svg:title") //mouseover title showing the figures
				   .text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });			

        d3.selectAll("g.slice").selectAll("path").transition()
			    .duration(750)
			    .delay(10)
			    .attr("d", arcFinal );
	
	//   // Add a label to the larger arcs, translated to the arc centroid and rotated.
	//   // source: http://bl.ocks.org/1305337#index.html
	  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
	  	.append("svg:text")
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
	      //.text(function(d) { return formatAsPercentage(d.value); })
	    .text(function(d) { return d.data.category; });  
	// Pie chart title			
		pieBody.append("svg:text")
	     	.attr("dy", ".01em")
	      .attr("text-anchor", "middle")
	      .text("Threads Grouped by Discussion Topics ")
	      .attr("class","title")
	     pieBody.append("svg:text")
	     	.attr("dy", "1.20em")
	      .attr("text-anchor", "middle")
	      .text("in "+ currentNode.icon)
	      .attr("class","course")
		pieBody.append("svg:text")
	     .attr("dy", "2.50em")
	      .attr("text-anchor", "middle")
	      .text("Total # of threads: "+ updatedData[1].thread_total)
	      .attr("class","total")
	

}

function datasetBarChosen1(group) {
	var ds = [];
	for (x in datasetBarChart1) {
		 if(datasetBarChart1[x].course_id==group){
		 	ds.push(datasetBarChart1[x]);
		 } 
		}
	return ds;
}

	
function updateBarChart1(currentNode) {
		group = currentNode.icon;
		colorChosen = "lightblue";
	
		var currentDatasetBarChart = datasetBarChosen1(group);
		
		var basics = dsBarChartBasics();
	
		var margin = basics.margin,
			width = basics.width,
		   height = basics.height,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding
			;
		
		var xScale = d3.scaleLinear()
			.domain([0, currentDatasetBarChart.length])
			.range([0, width])
			;
		
			
		var yScale = d3.scaleLinear()
	      .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
	      .range([height,0])
	      ;
	      
	   var svg = d3.select("#barChart svg");

	   //update here
// remove bar graph body
		d3.select("#barChartBody").remove()
// add the graph body back
	var plot = d3.select("#barChartPlot")
			.datum(currentDatasetBarChart)
			.append("g")
		    .attr("id", "barChartBody")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	  		/* Note that here we only have to select the elements - no more appending! */
	  	plot.selectAll("rect")
	      .data(currentDatasetBarChart)
	      .enter()
		  .append("rect")
	      .transition()
			.duration(750)
			.attr("x", function(d, i) {
			    return xScale(i);
			})
		   .attr("width", width / currentDatasetBarChart.length - barPadding)   
			.attr("y", function(d) {
			    return yScale(d.measure);
			})  
			.attr("height", function(d) {
			    return height-yScale(d.measure);
			})
			.attr("fill", colorChosen)
			;
	// y-axis labels	
	plot.selectAll("text")
	.data(currentDatasetBarChart)
	.enter()
	.append("text")
	.text(function(d) {
			return formatAsInteger(d.measure);
	})
	.attr("text-anchor", "middle")
	// Set x position to the left edge of each bar plus half the bar width
	.attr("x", function(d, i) {
			return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
	})
	.attr("y", function(d) {
			return yScale(d.measure) + 14;
	})
	.attr("class", "yAxis")					 
		;
// remove bar graph  x-axis labels 
		d3.select("#barChartPlot").select("#barLabels").remove()
// add new labels
		var xLabels =  d3.select("#barChartPlot")
						.append("g")
						.attr("id","barLabels" )
						.attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")");
	
	xLabels.selectAll("text.xAxis")
		  .data(currentDatasetBarChart)
		  .enter()
		  .append("text")
		  .text(function(d) { return d.user_type;})
		  .attr("text-anchor", "middle")
			// Set x position to the left edge of each bar plus half the bar width
						   .attr("x", function(d, i) {
						   		return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
						   })
		  .attr("y", 25)
		  .attr("class", "xAxis")
		  .attr("style", "font-size: 11; font-family: Helvetica, sans-serif")



		svg.selectAll("text.title") // target the text element(s) which has a title class defined
			.attr("x", (width + margin.left + margin.right)/2)
			.attr("y", 25)
			.attr("class","title")				
			.attr("text-anchor", "middle")
			.text("Number of Forum Posts By Various Users in "+ group)
		;
}	
//blur when click on the 
		function blur() {
			let target = d3.event.target;
			// check if click on document but not on the circle overlay
			if (!target.closest('#circle-overlay') && focusedNode) {
				focusedNode.fx = null;
				focusedNode.fy = null;
				simulation.alphaTarget(0.2).restart();
				d3.transition().duration(2000).ease(d3.easePolyOut)
					.tween('moveOut', function () {
						console.log('tweenMoveOut', focusedNode);
						let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
						return function (t) {
							focusedNode.r = ir(t);
							simulation.force('collide', forceCollide);
						};
					})
					.on('end', () => {
						focusedNode = null;
						simulation.alphaTarget(0);
					})
					.on('interrupt', () => {
						simulation.alphaTarget(0);
					});

				// hide all circle-overlay
				d3.selectAll('.circle-overlay').classed('hidden', true);
				d3.selectAll('.node-icon').classed('node-icon--faded', false);
			}
		}
//update bubble location
function ticked() {
	let node = svg.selectAll('.node')
			node.attr('transform', d => `translate(${d.x},${d.y})`)
				.select('circle')
				.attr('r', d => d.r);
			};

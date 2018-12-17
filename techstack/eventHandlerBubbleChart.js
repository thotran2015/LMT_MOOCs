//zoom in when click
		function zoom(currentNode){
			let node = svg.selectAll('.node')
			updatePieTitle(currentNode);
			updatePieGraph(currentNode);
			d3.event.stopPropagation();
			console.log('currentNode', currentNode);
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
	    .attr("class","title")}


function updatePieGraph(currentNode){
	console.log(currentNode.icon)
	var updatedData = datasetPieChosen(currentNode.icon)
	console.log(updatedData)
	var basics = dsPieChartBasics(pieColorScheme);
	//remove pie boyd
	d3.select("#pieChart").select("#pieChartPlot").select("#pieCenter").remove()
	var pieBody= d3.select("#pieChart").select("#pieChartPlot")
		.append("svg:g")                //make a group to hold our pie chart
	    .attr("id", "pieCenter")
	    .data([updatedData])                   //associate our data with the document
	    .attr("transform", "translate(" + basics.outerRadius + "," + basics.outerRadius + ")");
	   var arc = d3.arc()              //this will create <path> elements for us using arc data
        	.outerRadius(basics.outerRadius).innerRadius(basics.innerRadius);
 //   var arc = d3.arc()              //this will create <path> elements for us using arc data
 //        	.outerRadius(basics.outerRadius).innerRadius(basics.innerRadius);
 //   var pieSvg = d3.select("#pieChart").select("#pieChart svg");
 //   // for animation
 //   var arcFinal = d3.arc().innerRadius(basics.innerRadiusFinal).outerRadius(basics.outerRadius);
	// var arcFinal3 = d3.arc().innerRadius(basics.innerRadiusFinal3).outerRadius(basics.outerRadius);

   var pie = d3.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array
   console.log(pie)
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
	   
		    	
	// 	// Pie chart title			
	// 	vis.append("svg:text")
	//      	.attr("dy", ".35em")
	//       .attr("text-anchor", "middle")
	//       .text("Thread Forums")
	//       .attr("class","title")
	//       ;		    

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

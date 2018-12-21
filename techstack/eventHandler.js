   // for animation
var basics = dsPieChartBasics(d3.scaleOrdinal(d3.schemeCategory20b));
var arcFinal = d3.arc().innerRadius(basics.innerRadiusFinal).outerRadius(basics.outerRadius);
var arcFinal3 = d3.arc().innerRadius(basics.innerRadiusFinal3).outerRadius(basics.outerRadius);

	function mouseover() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		//.attr("stroke","red")
	        		//.attr("stroke-width", 1.5)
	        		.attr("d", arcFinal3)
	        		;
	}
	
	function mouseout() {
	  d3.select(this).select("path").transition()
	      .duration(750)
	        		//.attr("stroke","blue")
	        		//.attr("stroke-width", 1.5)
	        		.attr("d", arcFinal)
	        		;
	}
	
	function up(d, i) {
	
				/* update bar chart when user selects piece of the pie chart */
				//updateBarChart(dataset[i].category);
				//updateBarChart(d.data.category, basics.color(i));
				updateLineChart(d.data.category, basics.color(i));
			 
	}



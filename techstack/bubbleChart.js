var bubbleChart = function() {
	//size of chart
	var width = 700,
	height = 800;

	// chart function
	function chart(selection){

	}

	//width accessor function
	chart.width = function(value){
		if (!arguments.length) { return width;}
		width = value;
		return chart;
	}
	// height accessor function
	chart.height = function(value){
		if (!arguments.length) { return height;}
		height = value;
		return chart;
	}


	

	// return a chart function when called the bubbleChart, width, or height method so we can chain the methods together. 
	// It is called method chaining
	return chart;


}
//Pie Helper Functions
function datasetPieChosen(group) {
	var ds = [];
	for (x in dataPie1) {
		 if(dataPie1[x].course==group){
		 	ds.push(dataPie1[x]);
		 } 
		}
	return ds;
}

function dsPieChartBasics(pieColorScheme) {
	var margin = {top: 40, right: 5, bottom: 40, left: 50};
	var width = 500, height = 500, outerRadius = Math.min(width, height) / 2, innerRadius = outerRadius * .999,   
		// for animation
		innerRadiusFinal = outerRadius * .5, innerRadiusFinal3 = outerRadius* .45, color = pieColorScheme;   //builtin range of colors
		return { 
			width : width, 
			height : height, 
			outerRadius : outerRadius, 
			innerRadius : innerRadius,
			innerRadiusFinal: innerRadiusFinal,
			innerRadiusFinal3 : innerRadiusFinal3,
			color: color
		}			
		;
}
// Computes the label angle of an arc, converting from radians to degrees.
function angle(d) {
	var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
	return a > 90 ? a - 180 : a;
}

function dsBarChartBasics() {
	var margin = {top: 40, right: 5, bottom: 40, left: 50},
		width = 500 - margin.left - margin.right,
	   height = 300 - margin.top - margin.bottom,
		colorBar = barColorScheme,
		barPadding = 1
		;
		
		return {
			margin : margin, 
			width : width, 
			height : height, 
			colorBar : colorBar, 
			barPadding : barPadding
		}			
		;
}
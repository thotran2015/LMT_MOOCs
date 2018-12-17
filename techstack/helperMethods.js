//Pie Helper Functions
function datasetPieChosen(group) {
	var ds = [];
	for (x in dataPie) {
		 if(dataPie[x].group==group){
		 	ds.push(dataPie[x]);
		 } 
		}
	return ds;
}

function dsPieChartBasics(pieColorScheme) {
	var width = 400, height = 400, outerRadius = Math.min(width, height) / 2, innerRadius = outerRadius * .999,   
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
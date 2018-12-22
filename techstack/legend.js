
		//legend for the bubble color
		let legendOrdinal = d3.legendColor()
			.scale(scaleColor)
			.shape('circle');

		let legend = svg.append('g')
			.classed('legend-color', true)
			.attr('text-anchor', 'start')
			.attr('transform','translate(20,30)')
			.style('font-size','12px')
			.call(legendOrdinal);


		//legend for bubble size

		let sizeScale = d3.scaleOrdinal()
  			.domain(['fewer students', 'more students'])
  			.range([5, 10] );


		let legendSize = d3.legendSize()
			.scale(sizeScale)
			.shape('circle')
			.shapePadding(10)
			.labelAlign('end');

		let legend2 = svg.append('g')
			.classed('legend-size', true)
			.attr('text-anchor', 'start')
			.attr('transform', 'translate(150, 25)')
			.style('font-size', '12px')
			.call(legendSize);
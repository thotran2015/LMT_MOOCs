
		let svg = d3.select('svg');
		let width = document.body.clientWidth/2; // get width in pixels
		let height = +svg.attr('height');
		let centerX = width * 0.5;
		let centerY = height * 0.5;
		let strength = 0.05;
		let focusedNode;

		let format = d3.format(',d');

		let scaleColor = d3.scaleOrdinal(d3.schemeCategory20);
		let threadColor = d3.scaleOrdinal(d3.schemeCategory20b);
		

		// use pack to calculate radius of the circle
		let pack = d3.pack()
			.size([width , height ])
			.padding(1.5);

		let forceCollide = d3.forceCollide(d => d.r + 1);

		// use the force
		let simulation = d3.forceSimulation()
			// .force('link', d3.forceLink().id(d => d.id))
			.force('charge', d3.forceManyBody())
			.force('collide', forceCollide)
			// .force('center', d3.forceCenter(centerX, centerY))
			.force('x', d3.forceX(centerX ).strength(strength))
			.force('y', d3.forceY(centerY ).strength(strength));

		// reduce number of circles on mobile screen due to slow computation
		if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
			data = data.filter(el => {
				return el.value >= 50;
			});
		}

		function generateNode(node){
			console.log('node:', node.x, (node.x - centerX) * 2);
			const data = node.data;
			return {
				x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
				y: centerY + (node.y - centerY) * 3,
				r: 0, // for tweening
				radius: node.r, //original radius
				//id: data.icon,
				id: data.cat + '.' + (data.name.replace(/\s/g, '-')),
				cat: data.cat,
				name: data.name,
				value: data.value,
				icon: data.icon,
				desc: data.desc
			}
		};
let root = d3.hierarchy({ children: data }).sum(d => d.value);
let nodes = pack(root).leaves().map(generateNode);

function dsBubbleChart() {
		// we use pack() to automatically calculate radius conveniently only
		// and get only the leaves
		// let nodes = pack(root).leaves().map(generateNode);
		//update the circle locations
		simulation.nodes(nodes).on('tick', ticked);

		svg.style('background-color', '#eee');
		let node = svg.selectAll('.node')
			.data(nodes)
			.enter().append('g')
			.attr('class', 'node')
			.attr('id', d=>d.name)
			.call(d3.drag()
				.on('start', (d) => {
					if (!d3.event.active) simulation.alphaTarget(0.2).restart();
					d.fx = d.x;
					d.fy = d.y;
				})
				.on('drag', (d) => {
					d.fx = d3.event.x;
					d.fy = d3.event.y;
				})
				.on('end', (d) => {
					if (!d3.event.active) simulation.alphaTarget(0);
					d.fx = null;
					d.fy = null;
				}));

		node.append('circle')
			.attr('id', d => d.id)
			.attr('r', 0)
			.style('fill', d => scaleColor(d.cat))
			.style('stroke-width',  d=> 3)
			.transition().duration(2000).ease(d3.easeElasticOut)
				.tween('circleIn', (d) => {
					let i = d3.interpolateNumber(0, d.radius);
					return (t) => {
						d.r = i(t);
						simulation.force('collide', forceCollide);
					}
				})

		node.append('clipPath')
			.attr('id', d => `clip-${d.id}`)
			.append('use')
			.attr('xlink:href', d => `#${d.id}`);

		// display text as circle icon
		node.filter(d => !String(d.icon).includes('img/'))
			.append('text')
			.classed('node-icon', true)
			.attr('clip-path', d => `url(#clip-${d.id})`)
			.selectAll('tspan')
			.data(d => d.icon.split(';'))
			.enter()
				.append('tspan')
				.attr('x', 0)
				.attr('y', (d, i, nodes) => (13 + (i - nodes.length / 2 - 0.5) * 10))
				.text(name => name);

		// display image as circle icon
		node.filter(d => String(d.icon).includes('img/'))
			.append('image')
			.classed('node-icon', true)
			.attr('clip-path', d => `url(#clip-${d.id})`)
			.attr('xlink:href', d => d.icon)
			.attr('x', d => - d.radius * 0.7)
			.attr('y', d => - d.radius * 0.7)
			.attr('height', d => d.radius * 2 * 0.7)
			.attr('width', d => d.radius * 2 * 0.7);

		node.append('title')
			.text(d => (d.cat + '::' + d.name + '\n' + format(d.value)));

		let infoBox = node.append('foreignObject')
			.classed('circle-overlay hidden', true)
			.attr('x', -350 * 0.5 * 0.8)
			.attr('y', -350 * 0.5 * 0.8)
			.attr('height', 350 * 0.8)
			.attr('width', 350 * 0.8)
				.append('xhtml:div')
				.classed('circle-overlay__inner', true);

		infoBox.append('h4')
			.classed('circle-overlay__title', true)
			.text(d => d.name);

		infoBox.append('p')
			.classed('circle-overlay__body', true)
			.html(d => d.desc);

		//apply click method
		node.on('click', zoom);

		// apply blur method
		d3.select(document).on('click', blur);

		};

dsBubbleChart();

		


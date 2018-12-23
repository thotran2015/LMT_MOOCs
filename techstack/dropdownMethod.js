function zoomDropdown(currentNode){
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



var elements = $(document).find('select.form-control');

for (var i = 0, l = elements.length; i < l; i++) {
  var $select = $(elements[i]), $label = $select.parents('.form-group').find('label');
  
  var all_nodes = d3.select('svg').selectAll('g')._groups[0]
  //console.log(d3.select('svg').selectAll('g')._groups[0][0])
  
  $select.on('change', function(e){
    var selectedCourse = $select.select2('data')[0].id;
    var id = String(selectedCourse)
    for (i in nodes){
      if (nodes[i].name == selectedCourse){
        d3.select('svg').select('g').on('click')(nodes[i])
      }
      
    }

    });
  
  $select.select2({
    allowClear: false,
    placeholder: $select.data('placeholder'),
    minimumResultsForSearch: 0,
    theme: 'bootstrap',
		width: '100%' // https://github.com/select2/select2/issues/3278
  });
  
  // Trigger focus
  $label.on('click', function (e) {
    $(this).parents('.form-group').find('select').trigger('focus').select2('focus');
  });
  
  // Trigger search
  $select.on('keydown', function (e) {
    var $select = $(this), $select2 = $select.data('select2'), $container = $select2.$container;

    // Unprintable keys
    if (typeof e.which === 'undefined' || $.inArray(e.which, [0, 8, 9, 12, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 44, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123, 124, 144, 145, 224, 225, 57392, 63289]) >= 0) {
      return true;
    }

    // Opened dropdown
    if ($container.hasClass('select2-container--open')) {
      return true;
    }

    $select.select2('open');


    // Default search value
    var $search = $select2.dropdown.$search || $select2.selection.$search, query = $.inArray(e.which, [13, 40, 108]) < 0 ? String.fromCharCode(e.which) : '';
    if (query !== '') {
      $search.val(query).trigger('keyup');
    }

  });

  // Format, placeholder
  $select.on('select2:open', function (e) {
		var $select = $(this), $select2 = $select.data('select2'), $dropdown = $select2.dropdown.$dropdown || $select2.selection.$dropdown, $search = $select2.dropdown.$search || $select2.selection.$search, data = $select.select2('data');
    
    // Above dropdown
    if ($dropdown.hasClass('select2-dropdown--above')) {
      $dropdown.append($search.parents('.select2-search--dropdown').detach());
    }
    // Placeholder
    $search.attr('placeholder', (data[0].text !== '' ? data[0].text : $select.data('placeholder')));
  });


}

